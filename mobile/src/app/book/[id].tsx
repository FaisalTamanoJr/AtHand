import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Banner, Button, Card, Chip, Row, Screen, Section } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { addDays, LENDER_REPLY_HOURS, needsGuardianApproval, peso, quote, shortDate } from '@/lib/rules';
import { useApp } from '@/store/app-store';

const START_OPTIONS = [1, 2, 3, 7];

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { me, listing: findListing, user, actions, isAvailable } = useApp();
  const router = useRouter();
  const listing = findListing(id);
  const [startIn, setStartIn] = useState(1);
  const [days, setDays] = useState(listing?.minDays ?? 1);

  if (!listing) {
    return (
      <Screen>
        <ThemedText>This listing no longer exists.</ThemedText>
      </Screen>
    );
  }

  const today = new Date();
  today.setHours(9, 0, 0, 0);
  const start = addDays(today.toISOString(), startIn);
  const q = quote(listing, days, me);
  const available = isAvailable(listing.id, start, days);
  const guardian = needsGuardianApproval(me, listing) && me.guardianId ? user(me.guardianId) : undefined;
  const verified = me.verification === 'verified';

  const submit = () => {
    const bookingId = actions.requestBooking(listing, days, start);
    router.replace({ pathname: '/rental/[id]', params: { id: bookingId } });
  };

  return (
    <Screen
      footer={
        <Button
          label={guardian ? 'Send to guardian for approval' : 'Send request'}
          disabled={!available || !verified}
          onPress={submit}
        />
      }>
      <ThemedText type="heading">{listing.title}</ThemedText>

      <Section title="When">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
          {START_OPTIONS.map((n) => (
            <Chip
              key={n}
              label={n === 1 ? 'Tomorrow' : shortDate(addDays(today.toISOString(), n))}
              selected={startIn === n}
              onPress={() => setStartIn(n)}
            />
          ))}
        </View>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button label="−" variant="secondary" disabled={days <= listing.minDays} onPress={() => setDays(days - 1)} />
            <ThemedText type="smallBold">
              {days} day{days > 1 ? 's' : ''} · {shortDate(start)} – {shortDate(addDays(start, days))}
            </ThemedText>
            <Button label="+" variant="secondary" disabled={days >= listing.maxDays} onPress={() => setDays(days + 1)} />
          </View>
        </Card>
        {!available ? (
          <Banner tone="danger">
            <ThemedText type="small">Those dates overlap another booking. Pick different dates.</ThemedText>
          </Banner>
        ) : null}
      </Section>

      <Section title="Price breakdown">
        <Card>
          <Row label={`Rental (${peso(listing.dailyPrice)} × ${days})`} value={peso(q.rental)} />
          <Row label="Service fee (5%)" value={peso(q.serviceFee)} />
          <Row label={`Deposit (${q.depositRate * 100}% of ${peso(listing.value)}, refundable)`} value={peso(q.deposit)} />
          <Row label="Total" value={peso(q.total)} bold />
        </Card>
        <ThemedText type="small" themeColor="textSecondary">
          You pay after the lender accepts. The payment is held by the gateway until the return check passes.
        </ThemedText>
      </Section>

      <Banner tone="neutral">
        <ThemedText type="smallBold">Damage and safety policy</ThemedText>
        <ThemedText type="small">
          Your deposit covers damage up to its amount; the lender absorbs damage beyond it. You use borrowed items at your
          own risk. Free cancellation up to 24 hours before pickup, 50% of the rental fee after that.
        </ThemedText>
      </Banner>

      {guardian ? (
        <Banner tone="warning">
          <ThemedText type="small">
            This is a powered item, so {guardian.name} needs to approve it first. Then the lender has{' '}
            {LENDER_REPLY_HOURS} hours to reply.
          </ThemedText>
        </Banner>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          The lender has {LENDER_REPLY_HOURS} hours to accept, or the request expires.
        </ThemedText>
      )}

      {!verified ? (
        <Banner tone="warning">
          <ThemedText type="small">Verify your ID before your first rental.</ThemedText>
          <Button label="Verify now" onPress={() => router.push('/verify')} />
        </Banner>
      ) : null}
    </Screen>
  );
}
