import type { BookingStatus } from '@/data/types';

export const STATUS_LABEL: Record<BookingStatus, string> = {
  guardian_pending: 'Waiting for guardian',
  requested: 'Requested',
  accepted: 'Accepted · pay to confirm',
  paid: 'Paid · ready for pickup',
  picked_up: 'Rented out',
  returned: 'Returned · lender checking',
  completed: 'Completed',
  disputed: 'In dispute',
  resolved: 'Dispute resolved',
  declined: 'Declined',
};

export type StatusTone = 'neutral' | 'tint' | 'warning' | 'danger';

export const STATUS_TONE: Record<BookingStatus, StatusTone> = {
  guardian_pending: 'warning',
  requested: 'warning',
  accepted: 'warning',
  paid: 'tint',
  picked_up: 'tint',
  returned: 'warning',
  completed: 'neutral',
  disputed: 'danger',
  resolved: 'neutral',
  declined: 'neutral',
};

/** The happy path of the rental lifecycle, shown as a timeline. */
export const LIFECYCLE: { status: BookingStatus; label: string }[] = [
  { status: 'requested', label: 'Requested' },
  { status: 'accepted', label: 'Lender accepted' },
  { status: 'paid', label: 'Paid · held by gateway' },
  { status: 'picked_up', label: 'Pickup check done' },
  { status: 'returned', label: 'Return check done' },
  { status: 'completed', label: 'Payout released to lender' },
];

export const ACTIVE_STATUSES: BookingStatus[] = ['guardian_pending', 'requested', 'accepted', 'paid', 'picked_up', 'returned', 'disputed'];
