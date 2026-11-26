import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge, Banner, Button, Card, Row, Screen, Section, Thumb } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Booking, BookingStatus } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { LIFECYCLE, STATUS_LABEL, STATUS_TONE } from '@/lib/booking-status';
import { addDays, DISPUTE_HOURS, paymentState, peso, RETURN_CONFIRM_HOURS, shortDate } from '@/lib/rules';
import { useApp } from '@/store/app-store';

export default function RentalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { booking: findBooking, listing: findListing, user } = useApp();
  const router = useRouter();
  const booking = findBooking(id);
  const listing = booking ? findListing(booking.listingId) : undefined;

  if (!booking || !listing) {
    return (
      <Screen>
        <ThemedText>This rental no longer exists.</ThemedText>
      </Screen>
    );
  }

  const borrower = user(booking.borrowerId)!;
  const lender = user(listing.ownerId)!;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
        <Thumb emoji={listing.emoji} photo={listing.photo} size={56} />
        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText type="smallBold">{listing.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {borrower.name} borrows from {lender.name}
          </ThemedText>
          <Badge label={STATUS_LABEL[booking.status]} tone={STATUS_TONE[booking.status]} />
        </View>
      </View>

      <NextStep booking={booking} />

      <Section title="Progress">
        <Timeline booking={booking} />
      </Section>

      <Section title="Payment">
        <Card>
          <Row label="Dates" value={`${shortDate(booking.start)} – ${shortDate(addDays(booking.start, booking.days))}`} />
          <Row label="Rental" value={peso(booking.quote.rental)} />
          <Row label="Service fee (5%)" value={peso(booking.quote.serviceFee)} />
          <Row label="Deposit" value={peso(booking.quote.deposit)} />
          <Row label="Total" value={peso(booking.quote.total)} bold />
          <Row label="Status" value={paymentState(booking.status)} />
          {booking.paymentMethod ? <Row label="Paid with" value={booking.paymentMethod} /> : null}
        </Card>
      </Section>

      {booking.pickupCheck || booking.returnCheck ? (
        <Section title="Condition checks">
          <View style={{ flexDirection: 'row', gap: Spacing.two }}>
            <CheckSummary title="Pickup" check={booking.pickupCheck} emoji={listing.emoji} photo={listing.photo} />
            <CheckSummary title="Return" check={booking.returnCheck} emoji={listing.emoji} photo={listing.photo} />
          </View>
        </Section>
      ) : null}

      <View style={{ gap: Spacing.two }}>
        <Button label="Open chat" variant="secondary" onPress={() => router.push({ pathname: '/chat/[id]', params: { id: booking.id } })} />
        <Button
          label="Report a problem"
          variant="secondary"
          onPress={() => Alert.alert('Report a problem', 'Prototype: this would open a support ticket with the booking attached.')}
        />
      </View>
    </Screen>
  );
}

/** The one action that moves this rental forward, labelled with who takes it. */
function NextStep({ booking }: { booking: Booking }) {
  const { actions, user, listing: findListing } = useApp();
  const router = useRouter();
  const listing = findListing(booking.listingId)!;
  const borrower = user(booking.borrowerId)!;
  const lender = user(listing.ownerId)!;
  const set = (status: BookingStatus) => actions.setStatus(booking.id, status);

  switch (booking.status) {
    case 'guardian_pending': {
      const guardian = borrower.guardianId ? user(borrower.guardianId) : undefined;
      return (
        <Step who={`Guardian · ${guardian?.name ?? ''}`} text="Approve this powered-item booking for a minor.">
          <Button label="Approve" onPress={() => set('requested')} />
          <Button label="Decline" variant="danger" onPress={() => set('declined')} />
        </Step>
      );
    }
    case 'requested':
      return (
        <Step who={`Lender · ${lender.name}`} text="Accept or decline within 24 hours. Accepted dates lock the item.">
          <Button label="Accept" onPress={() => set('accepted')} />
          <Button label="Decline" variant="danger" onPress={() => set('declined')} />
        </Step>
      );
    case 'accepted':
      return (
        <Step who={`Borrower · ${borrower.name}`} text="Pay to confirm. The gateway holds the money until the return check passes.">
          <Button label={`Pay ${peso(booking.quote.total)}`} onPress={() => router.push({ pathname: '/pay/[id]', params: { id: booking.id } })} />
        </Step>
      );
    case 'paid':
      return (
        <Step who={`Borrower · ${borrower.name}`} text="At the meetup, take the pickup photos and confirm the item matches the listing.">
          <Button
            label="Start pickup check"
            onPress={() => router.push({ pathname: '/check/[id]', params: { id: booking.id, kind: 'pickup' } })}
          />
        </Step>
      );
    case 'picked_up':
      return (
        <Step who={`Borrower · ${borrower.name}`} text={`Return by ${shortDate(addDays(booking.start, booking.days))}. Take the return photos at the handoff.`}>
          <Button
            label="Start return check"
            onPress={() => router.push({ pathname: '/check/[id]', params: { id: booking.id, kind: 'return' } })}
          />
        </Step>
      );
    case 'returned':
      return (
        <Step
          who={`Lender · ${lender.name}`}
          text={`Confirm the item came back OK, or flag damage. Auto-confirms after ${RETURN_CONFIRM_HOURS} hours.`}>
          <Button label="Confirm return" onPress={() => set('completed')} />
          <Button label="Flag damage" variant="danger" onPress={() => set('disputed')} />
        </Step>
      );
    case 'disputed':
      return (
        <Step
          who="AtHand support"
          text={`Payout is frozen. Support compares the pickup and return photos and the chat, then decides. Either side can open a dispute within ${DISPUTE_HOURS} hours of the return.`}>
          <Button label="Support: deduct half the deposit (demo)" onPress={() => set('resolved')} />
        </Step>
      );
    case 'completed':
      return booking.review ? (
        <Banner tone="neutral">
          <ThemedText type="small">Done. {borrower.name} rated this rental {'★'.repeat(booking.review)}.</ThemedText>
        </Banner>
      ) : (
        <Step who={`Borrower · ${borrower.name}`} text="Payout released. How did it go?">
          <Stars onRate={(review) => actions.setStatus(booking.id, 'completed', { review })} />
        </Step>
      );
    case 'resolved':
      return (
        <Banner tone="neutral">
          <ThemedText type="small">
            Support deducted {peso(booking.quote.deposit / 2)} from the deposit for the lender and refunded the rest.
          </ThemedText>
        </Banner>
      );
    case 'declined':
      return (
        <Banner tone="neutral">
          <ThemedText type="small">This request was declined. Nothing was charged.</ThemedText>
        </Banner>
      );
  }
}

function Step({ who, text, children }: { who: string; text: string; children: ReactNode }) {
  return (
    <Banner tone="warning">
      <ThemedText type="smallBold">Next: {who}</ThemedText>
      <ThemedText type="small">{text}</ThemedText>
      <View style={{ gap: Spacing.two, marginTop: Spacing.two }}>{children}</View>
      <ThemedText type="small" themeColor="textSecondary">
        Demo: one phone plays every role.
      </ThemedText>
    </Banner>
  );
}

function Stars({ onRate }: { onRate: (stars: number) => void }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: Spacing.two }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} accessibilityRole="button" accessibilityLabel={`${n} stars`} onPress={() => onRate(n)}>
          <ThemedText style={{ fontSize: 32, lineHeight: 40, color: theme.warning }}>★</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

function Timeline({ booking }: { booking: Booking }) {
  const theme = useTheme();
  const reached = new Set(booking.history.map((h) => h.status));
  const steps = booking.history.some((h) => h.status === 'guardian_pending')
    ? [{ status: 'guardian_pending' as const, label: 'Guardian asked' }, ...LIFECYCLE]
    : LIFECYCLE;
  return (
    <Card>
      {steps.map((step) => {
        const done = reached.has(step.status);
        const at = booking.history.find((h) => h.status === step.status)?.at;
        return (
          <View key={step.status} style={{ flexDirection: 'row', gap: Spacing.two, alignItems: 'center' }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: done ? theme.tint : theme.backgroundSelected,
              }}
            />
            <ThemedText type="small" themeColor={done ? 'text' : 'textSecondary'} style={{ flex: 1 }}>
              {step.label}
            </ThemedText>
            {at ? (
              <ThemedText type="small" themeColor="textSecondary">
                {shortDate(at)}
              </ThemedText>
            ) : null}
          </View>
        );
      })}
    </Card>
  );
}

function CheckSummary({
  title,
  check,
  emoji,
  photo,
}: {
  title: string;
  check?: Booking['pickupCheck'];
  emoji: string;
  photo?: number;
}) {
  return (
    <Card style={{ flex: 1 }}>
      <ThemedText type="smallBold">{title}</ThemedText>
      {check ? (
        <>
          <Thumb emoji={emoji} photo={photo} size={56} />
          <ThemedText type="small" themeColor="textSecondary">
            {check.photos} photos · {check.checklist.length} checks · server time {shortDate(check.serverTime)}
          </ThemedText>
        </>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          Not done yet
        </ThemedText>
      )}
    </Card>
  );
}
