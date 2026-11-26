import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar, Badge, Banner, Button, Card, Row, Screen, Section } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { User } from '@/data/types';
import { DEPOSIT_RATE, trustTier } from '@/lib/rules';
import { useApp } from '@/store/app-store';

export default function ProfileScreen() {
  const { state, me, actions, user } = useApp();
  const router = useRouter();
  const tier = trustTier(me);
  const guardian = me.guardianId ? user(me.guardianId) : undefined;
  const wards = state.users.filter((u) => u.guardianId === me.id);

  return (
    <Screen tab>
      <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
        <Avatar name={me.name} size={64} />
        <View style={{ flex: 1, gap: Spacing.one }}>
          <ThemedText type="heading">{me.name}</ThemedText>
          <VerificationBadge user={me} />
        </View>
      </View>

      {me.verification === 'unverified' ? (
        <Banner tone="warning">
          <ThemedText type="smallBold">Verify your ID to start renting</ThemedText>
          <ThemedText type="small">Use a student ID or any government ID, plus a live selfie.</ThemedText>
          <Button label="Verify now" onPress={() => router.push('/verify')} />
        </Banner>
      ) : null}
      {me.verification === 'pending' ? (
        <Banner tone="warning">
          <ThemedText type="smallBold">ID check in progress</ThemedText>
          <ThemedText type="small">An AtHand admin reviews your ID and selfie, usually within a day.</ThemedText>
          <Button label="Admin: approve (demo)" variant="secondary" onPress={() => actions.approveVerification(me.id)} />
        </Banner>
      ) : null}

      <Card>
        <Row label="Rating" value={me.rating > 0 ? `★ ${me.rating.toFixed(1)}` : 'No reviews yet'} />
        <Row label="Completed rentals" value={String(me.completedRentals)} />
        <Row label="Response time" value={me.responseTime} />
        <Row label="Member since" value={me.memberSince} />
        <Row label="Area" value={me.area} />
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ThemedText type="smallBold">Trust tier</ThemedText>
          <Badge label={tier} tone={tier === 'Trusted' ? 'tint' : 'neutral'} />
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          Your deposit is {DEPOSIT_RATE[tier] * 100}% of an item&apos;s declared value.
          {tier === 'New'
            ? ' Reach Trusted (10%) with 5 completed rentals, a 4.0+ rating and no lost disputes.'
            : ' Keep your rating at 4.0+ with no lost disputes to stay Trusted.'}
        </ThemedText>
      </Card>

      {guardian ? (
        <Card>
          <ThemedText type="smallBold">Guardian: {guardian.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            You&apos;re under 18. Your guardian receives your payouts and approves bookings of powered or electrical
            items.
          </ThemedText>
        </Card>
      ) : null}
      {wards.length > 0 ? (
        <Card>
          <ThemedText type="smallBold">Guardian for: {wards.map((w) => w.name).join(', ')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Approval requests appear in your Inbox and Rentals.
          </ThemedText>
        </Card>
      ) : null}

      <Section title="Help">
        <Button
          label="Damage and safety policy"
          variant="secondary"
          onPress={() =>
            Alert.alert(
              'Damage and safety policy',
              'Your deposit covers damage up to its amount. Lenders absorb damage beyond the deposit. You use borrowed items at your own risk. Disputes can be opened within 72 hours of a return.',
            )
          }
        />
        <Button label="Help centre" variant="secondary" onPress={() => Alert.alert('Help centre', 'Prototype: not built yet.')} />
      </Section>

      <Section title="Demo: switch user">
        <ThemedText type="small" themeColor="textSecondary">
          This prototype runs every role on one phone. Pick who you are.
        </ThemedText>
        {state.users.map((u) => (
          <Card key={u.id} onPress={() => actions.switchUser(u.id)} style={u.id === me.id ? { opacity: 0.5 } : undefined}>
            <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
              <Avatar name={u.name} size={32} />
              <View style={{ flex: 1 }}>
                <ThemedText type="smallBold">
                  {u.name}
                  {u.id === me.id ? ' (you)' : ''}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {describe(u)}
                </ThemedText>
              </View>
            </View>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}

function VerificationBadge({ user }: { user: User }) {
  if (user.verification === 'verified') return <Badge label={`Verified · ${user.idType}`} tone="tint" />;
  if (user.verification === 'pending') return <Badge label="ID check pending" tone="warning" />;
  return <Badge label="Not verified" tone="danger" />;
}

function describe(u: User): string {
  if (u.isMinor) return 'Student, under 18, has a guardian';
  if (u.verification === 'unverified') return 'New, not verified yet';
  return `${u.idType === 'Student ID' ? 'Student' : 'Household'} · ${trustTier(u)} tier`;
}
