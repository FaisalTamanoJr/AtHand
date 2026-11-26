import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge, Banner, Card, Screen, Section, Segmented, Thumb } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Booking } from '@/data/types';
import { ACTIVE_STATUSES, STATUS_LABEL, STATUS_TONE } from '@/lib/booking-status';
import { addDays, peso, shortDate } from '@/lib/rules';
import { useApp } from '@/store/app-store';

type Side = 'borrowing' | 'lending';

export default function RentalsScreen() {
  const { state, me, listing } = useApp();
  const [side, setSide] = useState<Side>('borrowing');

  // Guardians see their wards' bookings alongside their own (FR-41).
  const borrowerIds = [me.id, ...state.users.filter((u) => u.guardianId === me.id).map((u) => u.id)];
  const mine = state.bookings.filter((b) =>
    side === 'borrowing' ? borrowerIds.includes(b.borrowerId) : listing(b.listingId)?.ownerId === me.id,
  );
  const active = mine.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const past = mine.filter((b) => !ACTIVE_STATUSES.includes(b.status));

  return (
    <Screen tab>
      <ThemedText type="heading">Rentals</ThemedText>
      <Segmented
        value={side}
        onChange={setSide}
        options={[
          { value: 'borrowing', label: 'Borrowing' },
          { value: 'lending', label: 'Lending' },
        ]}
      />
      <Section title="Active">
        {active.length === 0 ? (
          <Banner tone="neutral">
            <ThemedText type="small">No active rentals.</ThemedText>
          </Banner>
        ) : (
          active.map((b) => <BookingCard key={b.id} booking={b} />)
        )}
      </Section>
      {past.length > 0 ? (
        <Section title="History">
          {past.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </Section>
      ) : null}
    </Screen>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const { listing } = useApp();
  const router = useRouter();
  const item = listing(booking.listingId);
  if (!item) return null;
  return (
    <Card onPress={() => router.push({ pathname: '/rental/[id]', params: { id: booking.id } })}>
      <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
        <Thumb emoji={item.emoji} size={48} />
        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText type="smallBold">{item.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {shortDate(booking.start)} – {shortDate(addDays(booking.start, booking.days))} · {peso(booking.quote.total)}
          </ThemedText>
          <Badge label={STATUS_LABEL[booking.status]} tone={STATUS_TONE[booking.status]} />
        </View>
      </View>
    </Card>
  );
}
