import type { BookingStatus, Listing, Quote, User } from '@/data/types';

/** D7: the borrower pays a 5% service fee on top of the lender's price. */
export const SERVICE_FEE_RATE = 0.05;

/** D12: declared item value cap for the pilot. */
export const MAX_ITEM_VALUE = 50_000;

/** FR-15, FR-23, FR-35 time windows, in hours. */
export const LENDER_REPLY_HOURS = 24;
export const RETURN_CONFIRM_HOURS = 48;
export const DISPUTE_HOURS = 72;

export type TrustTier = 'New' | 'Trusted';

/** D4 / FR-19: deposit as a share of declared item value. Never zero. */
export const DEPOSIT_RATE: Record<TrustTier, number> = { New: 0.2, Trusted: 0.1 };

/** FR-32: Trusted = 5+ completed rentals, average rating 4.0+, no lost disputes. */
export function trustTier(user: User): TrustTier {
  return user.completedRentals >= 5 && user.rating >= 4.0 && user.lostDisputes === 0
    ? 'Trusted'
    : 'New';
}

export function quote(listing: Listing, days: number, borrower: User): Quote {
  const rental = listing.dailyPrice * days;
  const serviceFee = Math.round(rental * SERVICE_FEE_RATE);
  const depositRate = DEPOSIT_RATE[trustTier(borrower)];
  const deposit = Math.round(listing.value * depositRate);
  return { rental, serviceFee, deposit, depositRate, total: rental + serviceFee + deposit };
}

/** D11 / FR-41: a minor's booking of a powered item needs guardian approval first. */
export function needsGuardianApproval(borrower: User, listing: Listing): boolean {
  return Boolean(borrower.isMinor && listing.powered);
}

export type PaymentState = 'Not paid' | 'Held by gateway' | 'Released to lender' | 'Frozen (dispute)' | 'Partly refunded';

/** D5: where the money is, derived from the booking status. */
export function paymentState(status: BookingStatus): PaymentState {
  switch (status) {
    case 'paid':
    case 'picked_up':
    case 'returned':
      return 'Held by gateway';
    case 'completed':
      return 'Released to lender';
    case 'disputed':
      return 'Frozen (dispute)';
    case 'resolved':
      return 'Partly refunded';
    default:
      return 'Not paid';
  }
}

const SCAM_PATTERNS = [
  /(\+?63|\b0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/, // PH mobile number
  /https?:\/\/|www\./i, // links
  /\b(gcash|maya|bank|pay|send)\b.*\b(direct|directly|outside|instead|me)\b/i, // paying outside the app
];

/** FR-28: warn when a message looks like an attempt to deal outside the app. */
export function looksLikeScam(text: string): boolean {
  return SCAM_PATTERNS.some((pattern) => pattern.test(text));
}

export function peso(amount: number): string {
  return `₱${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
