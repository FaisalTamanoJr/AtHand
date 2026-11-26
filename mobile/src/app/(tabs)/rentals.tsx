import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/icon';
import { Badge, Banner, Card, HeroTitle, Screen, Section, Segmented, Thumb } from '@/components/ui';
import { CATEGORY_STYLE } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import type { Booking } from '@/data/types';
import { ACTIVE_STATUSES, STATUS_LABEL, STATUS_TONE } from '@/lib/booking-status';
import { addDays, peso, shortDate } from '@/lib/rules';
import { useTheme } from '@/hooks/use-theme';
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
    <Screen
      tab
      hero={
        <>
          <HeroTitle title="Rentals" subtitle={`${active.length} active · ${past.length} past`} />
          <Segmented
            onHero
            value={side}
            onChange={setSide}
            options={[
              { value: 'borrowing', label: 'Borrowing', icon: { ios: 'magnifyingglass', md: 'search' } },
              { value: 'lending', label: 'Lending', icon: { ios: 'tag', md: 'sell' } },
            ]}
          />
        </>
      }>
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
  const theme = useTheme();
  const item = listing(booking.listingId);
  if (!item) return null;
  return (
    <Card onPress={() => router.push({ pathname: '/rental/[id]', params: { id: booking.id } })}>
      <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
        <Thumb emoji={item.emoji} photo={item.photo} size={52} color={CATEGORY_STYLE[item.category].color} />
        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText type="smallBold">{item.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {shortDate(booking.start)} – {shortDate(addDays(booking.start, booking.days))} · {peso(booking.quote.total)}
          </ThemedText>
          <Badge label={STATUS_LABEL[booking.status]} tone={STATUS_TONE[booking.status]} />
        </View>
        <Icon name={{ ios: 'chevron.right', md: 'chevron_right' }} size={18} color={theme.textSecondary} />
      </View>
    </Card>
  );
}
