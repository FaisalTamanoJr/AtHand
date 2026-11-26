import { createContext, useContext, useReducer, type ReactNode } from 'react';

import { BOOKINGS, LISTINGS, MESSAGES, NOTICES, USERS } from '@/data/mock';
import type {
  Booking,
  BookingStatus,
  CheckKind,
  ConditionCheck,
  Listing,
  Message,
  Notice,
  PaymentMethod,
  User,
} from '@/data/types';
import { needsGuardianApproval, quote } from '@/lib/rules';

export type Mode = 'borrow' | 'lend';

type State = {
  currentUserId: string;
  mode: Mode;
  users: User[];
  listings: Listing[];
  bookings: Booking[];
  messages: Message[];
  notices: Notice[];
};

type Action =
  | { type: 'switchUser'; userId: string }
  | { type: 'setMode'; mode: Mode }
  | { type: 'addListing'; listing: Listing }
  | { type: 'addBooking'; booking: Booking }
  | { type: 'setStatus'; bookingId: string; status: BookingStatus; patch?: Partial<Booking> }
  | { type: 'sendMessage'; message: Message }
  | { type: 'patchUser'; userId: string; patch: Partial<User> };

const initialState: State = {
  currentUserId: 'bea',
  mode: 'borrow',
  users: USERS,
  listings: LISTINGS,
  bookings: BOOKINGS,
  messages: MESSAGES,
  notices: NOTICES,
};

const DAY_MS = 24 * 60 * 60 * 1000;
const LOCKING_STATUSES: BookingStatus[] = ['accepted', 'paid', 'picked_up', 'returned', 'disputed'];

let counter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${counter++}`;
const nowIso = () => new Date().toISOString();

/** Who gets told about each status change, and what they're told (FR-29). */
function noticeFor(state: State, booking: Booking, status: BookingStatus): Notice | undefined {
  const listing = state.listings.find((l) => l.id === booking.listingId);
  const borrower = state.users.find((u) => u.id === booking.borrowerId);
  if (!listing || !borrower) return undefined;
  const toLender = (text: string): Notice => ({ id: newId('n'), userId: listing.ownerId, text, at: nowIso(), bookingId: booking.id });
  const toBorrower = (text: string): Notice => ({ id: newId('n'), userId: borrower.id, text, at: nowIso(), bookingId: booking.id });
  switch (status) {
    case 'guardian_pending':
      return borrower.guardianId
        ? { id: newId('n'), userId: borrower.guardianId, text: `${borrower.name} wants to borrow ${listing.title}. Your approval is needed.`, at: nowIso(), bookingId: booking.id }
        : undefined;
    case 'requested':
      return toLender(`${borrower.name} requested your ${listing.title}. Reply within 24 hours.`);
    case 'accepted':
      return toBorrower(`Your request for ${listing.title} was accepted. Pay to confirm.`);
    case 'declined':
      return toBorrower(`Your request for ${listing.title} was declined.`);
    case 'paid':
      return toLender(`${borrower.name} paid for ${listing.title}. Payment is held until the return check.`);
    case 'picked_up':
      return toLender(`Pickup check done for ${listing.title}. The rental has started.`);
    case 'returned':
      return toLender(`${listing.title} was returned. Confirm or flag damage within 48 hours.`);
    case 'completed':
      return toBorrower(`Return confirmed for ${listing.title}. Leave a review.`);
    case 'disputed':
      return toBorrower(`The lender flagged damage on ${listing.title}. Support is reviewing.`);
    case 'resolved':
      return toBorrower(`Support resolved the dispute on ${listing.title}.`);
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'switchUser':
      return { ...state, currentUserId: action.userId };
    case 'setMode':
      return { ...state, mode: action.mode };
    case 'addListing':
      return { ...state, listings: [action.listing, ...state.listings] };
    case 'addBooking': {
      const notice = noticeFor(state, action.booking, action.booking.status);
      return {
        ...state,
        bookings: [action.booking, ...state.bookings],
        notices: notice ? [notice, ...state.notices] : state.notices,
      };
    }
    case 'setStatus': {
      const booking = state.bookings.find((b) => b.id === action.bookingId);
      if (!booking) return state;
      const updated: Booking = {
        ...booking,
        ...action.patch,
        status: action.status,
        history: [...booking.history, { status: action.status, at: nowIso() }],
      };
      const notice = noticeFor(state, updated, action.status);
      return {
        ...state,
        bookings: state.bookings.map((b) => (b.id === booking.id ? updated : b)),
        notices: notice ? [notice, ...state.notices] : state.notices,
      };
    }
    case 'sendMessage':
      return { ...state, messages: [...state.messages, action.message] };
    case 'patchUser':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, ...action.patch } : u)),
      };
  }
}

function useStore() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const me = state.users.find((u) => u.id === state.currentUserId)!;

  const actions = {
    switchUser: (userId: string) => dispatch({ type: 'switchUser', userId }),
    setMode: (mode: Mode) => dispatch({ type: 'setMode', mode }),
    addListing: (listing: Omit<Listing, 'id' | 'ownerId' | 'rating' | 'matchedDescription' | 'distanceKm'>) =>
      dispatch({
        type: 'addListing',
        listing: { ...listing, id: newId('l'), ownerId: me.id, rating: 0, matchedDescription: 0, distanceKm: 0 },
      }),
    /** FR-15: request dates. Check `isAvailable` first (FR-16). Returns the new booking id. */
    requestBooking: (listing: Listing, days: number, start: string): string => {
      const status: BookingStatus = needsGuardianApproval(me, listing) ? 'guardian_pending' : 'requested';
      const booking: Booking = {
        id: newId('b'),
        listingId: listing.id,
        borrowerId: me.id,
        days,
        start,
        quote: quote(listing, days, me),
        status,
        history: [{ status, at: nowIso() }],
      };
      dispatch({ type: 'addBooking', booking });
      return booking.id;
    },
    setStatus: (bookingId: string, status: BookingStatus, patch?: Partial<Booking>) =>
      dispatch({ type: 'setStatus', bookingId, status, patch }),
    pay: (bookingId: string, paymentMethod: PaymentMethod) =>
      dispatch({ type: 'setStatus', bookingId, status: 'paid', patch: { paymentMethod } }),
    recordCheck: (bookingId: string, kind: CheckKind, check: ConditionCheck) =>
      dispatch({
        type: 'setStatus',
        bookingId,
        status: kind === 'pickup' ? 'picked_up' : 'returned',
        patch: kind === 'pickup' ? { pickupCheck: check } : { returnCheck: check },
      }),
    sendMessage: (threadId: string, text: string) =>
      dispatch({ type: 'sendMessage', message: { id: newId('m'), threadId, fromId: me.id, text, at: nowIso() } }),
    submitVerification: (idType: User['idType']) =>
      dispatch({ type: 'patchUser', userId: me.id, patch: { verification: 'pending', idType } }),
    approveVerification: (userId: string) =>
      dispatch({ type: 'patchUser', userId, patch: { verification: 'verified' } }),
  };

  const helpers = {
    user: (id: string) => state.users.find((u) => u.id === id),
    listing: (id: string) => state.listings.find((l) => l.id === id),
    booking: (id: string) => state.bookings.find((b) => b.id === id),
    /** FR-16: dates are locked once a booking is accepted, so overlapping requests are rejected. */
    isAvailable: (listingId: string, start: string, days: number) => {
      const from = new Date(start).getTime();
      const to = from + days * DAY_MS;
      return !state.bookings.some((b) => {
        if (b.listingId !== listingId || !LOCKING_STATUSES.includes(b.status)) return false;
        const bFrom = new Date(b.start).getTime();
        const bTo = bFrom + b.days * DAY_MS;
        return from < bTo && bFrom < to;
      });
    },
  };

  return { state, me, actions, ...helpers };
}

type Store = ReturnType<typeof useStore>;

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useApp(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useApp must be used inside AppStoreProvider');
  return store;
}
