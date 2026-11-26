export const CATEGORIES = [
  'Lab gear',
  'Calculators',
  'Cameras & lighting',
  'Audio',
  'Costumes',
  'Kitchenware',
  'Electronics',
  'Tools',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const ID_TYPES = ['Student ID', 'PhilSys ID', "Driver's license", 'Passport', 'UMID'] as const;
export type IdType = (typeof ID_TYPES)[number];

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export type User = {
  id: string;
  name: string;
  verification: VerificationStatus;
  idType?: IdType;
  rating: number;
  completedRentals: number;
  lostDisputes: number;
  memberSince: string;
  responseTime: string;
  area: string;
  /** Users under 18 need a linked guardian account (FR-41). */
  isMinor?: boolean;
  guardianId?: string;
};

export type SafetyChecklist = {
  powersOn: boolean;
  cordIntact: boolean;
  noExposedWiring: boolean;
  grounded: boolean;
  lastCalibration?: string;
};

export type Listing = {
  id: string;
  ownerId: string;
  title: string;
  category: Category;
  emoji: string;
  /** Bundled photo from `require()`. Listings made in the app have none and fall back to the emoji. */
  photo?: number;
  description: string;
  knownDefects: string;
  /** Declared item value in pesos, capped at MAX_ITEM_VALUE. */
  value: number;
  dailyPrice: number;
  minDays: number;
  maxDays: number;
  area: string;
  distanceKm: number;
  /** Powered or electrical items need the safety checklist (FR-06). */
  powered: boolean;
  safety?: SafetyChecklist;
  rating: number;
  matchedDescription: number;
};

export type BookingStatus =
  | 'guardian_pending'
  | 'requested'
  | 'accepted'
  | 'paid'
  | 'picked_up'
  | 'returned'
  | 'completed'
  | 'disputed'
  | 'resolved'
  | 'declined';

export type CheckKind = 'pickup' | 'return';

export type ConditionCheck = {
  photos: number;
  checklist: string[];
  /** Server time on upload (NFR-05). */
  serverTime: string;
};

export type Quote = {
  rental: number;
  serviceFee: number;
  deposit: number;
  depositRate: number;
  total: number;
};

export type Booking = {
  id: string;
  listingId: string;
  borrowerId: string;
  days: number;
  start: string;
  quote: Quote;
  status: BookingStatus;
  history: { status: BookingStatus; at: string }[];
  pickupCheck?: ConditionCheck;
  returnCheck?: ConditionCheck;
  paymentMethod?: PaymentMethod;
  review?: number;
};

export type PaymentMethod = 'GCash' | 'Maya' | 'Card';

export type Message = {
  id: string;
  threadId: string;
  fromId: string;
  text: string;
  at: string;
};

export type Notice = {
  id: string;
  userId: string;
  text: string;
  at: string;
  bookingId?: string;
};
