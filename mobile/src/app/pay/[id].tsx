import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Banner, Button, Card, Chip, Row, Screen, Section } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { PaymentMethod } from '@/data/types';
import { peso } from '@/lib/rules';
import { useApp } from '@/store/app-store';

const METHODS: PaymentMethod[] = ['GCash', 'Maya', 'Card'];

export default function PayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { booking: findBooking, actions } = useApp();
  const router = useRouter();
  const booking = findBooking(id);
  const [method, setMethod] = useState<PaymentMethod>('GCash');

  if (!booking) {
    return (
      <Screen>
        <ThemedText>This rental no longer exists.</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <Button
          label={`Pay ${peso(booking.quote.total)} with ${method} (simulated)`}
          onPress={() => {
            actions.pay(booking.id, method);
            router.back();
          }}
        />
      }>
      <Section title="Pay with">
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {METHODS.map((m) => (
            <Chip key={m} label={m} selected={method === m} onPress={() => setMethod(m)} />
          ))}
        </View>
      </Section>
      <Card>
        <Row label="Rental" value={peso(booking.quote.rental)} />
        <Row label="Service fee (5%)" value={peso(booking.quote.serviceFee)} />
        <Row label="Deposit (refundable)" value={peso(booking.quote.deposit)} />
        <Row label="Total" value={peso(booking.quote.total)} bold />
      </Card>
      <Banner>
        <ThemedText type="small">
          A licensed payment gateway holds your money. The lender is paid only after the return check passes. Your deposit
          comes back unless damage is found. AtHand never stores your card or e-wallet details.
        </ThemedText>
      </Banner>
    </Screen>
  );
}
