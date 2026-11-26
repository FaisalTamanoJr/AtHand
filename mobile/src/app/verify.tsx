import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Banner, Button, Chip, Screen, Section } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { ID_TYPES, type IdType } from '@/data/types';
import { useApp } from '@/store/app-store';

export default function VerifyScreen() {
  const { actions } = useApp();
  const router = useRouter();
  const [idType, setIdType] = useState<IdType>('Student ID');
  const [idPhoto, setIdPhoto] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [payout, setPayout] = useState(false);

  return (
    <Screen
      footer={
        <Button
          label="Submit for review"
          disabled={!idPhoto || !selfie}
          onPress={() => {
            actions.submitVerification(idType);
            router.back();
          }}
        />
      }>
      <ThemedText type="small" themeColor="textSecondary">
        AtHand checks every borrower and lender before their first rental. An admin compares your ID with a live selfie.
        ID images are encrypted and deleted after the check; only the result is kept.
      </ThemedText>

      <Section title="1. Choose your ID">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
          {ID_TYPES.map((t) => (
            <Chip key={t} label={t} selected={idType === t} onPress={() => setIdType(t)} />
          ))}
        </View>
      </Section>

      <Section title="2. Photograph your ID">
        <Button label={idPhoto ? '✓ ID captured' : 'Take photo of ID (simulated)'} variant={idPhoto ? 'secondary' : 'primary'} onPress={() => setIdPhoto(true)} />
      </Section>

      <Section title="3. Live selfie">
        <Button label={selfie ? '✓ Selfie captured' : 'Take live selfie (simulated)'} variant={selfie ? 'secondary' : 'primary'} onPress={() => setSelfie(true)} />
      </Section>

      <Section title="4. Payout account (lenders)">
        <ThemedText type="small" themeColor="textSecondary">
          Planning to lend? Link the GCash or bank account your earnings go to. Under 18? Your guardian&apos;s account is
          used instead.
        </ThemedText>
        <Button label={payout ? '✓ GCash linked' : 'Link GCash (simulated, optional)'} variant="secondary" onPress={() => setPayout(true)} />
      </Section>

      <Banner tone="neutral">
        <ThemedText type="small">By submitting, you consent to AtHand processing your ID under the Data Privacy Act of 2012.</ThemedText>
      </Banner>
    </Screen>
  );
}
