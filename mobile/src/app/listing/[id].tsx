import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar, Badge, Banner, Button, Card, Row, Screen, Section, Thumb } from '@/components/ui';
import { CATEGORY_STYLE } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { DEPOSIT_RATE, peso, trustTier } from '@/lib/rules';
import { useApp } from '@/store/app-store';

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { me, listing: findListing, user } = useApp();
  const router = useRouter();
  const listing = findListing(id);

  if (!listing) {
    return (
      <Screen>
        <ThemedText>This listing no longer exists.</ThemedText>
      </Screen>
    );
  }

  const owner = user(listing.ownerId)!;
  const isMine = owner.id === me.id;
  const deposit = Math.round(listing.value * DEPOSIT_RATE[trustTier(me)]);

  return (
    <Screen
      footer={
        isMine ? (
          <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
            This is your listing.
          </ThemedText>
        ) : (
          <Button
            label={`Request to borrow · ${peso(listing.dailyPrice)}/day`}
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: listing.id } })}
          />
        )
      }>
      <Stack.Screen options={{ title: listing.category }} />
      {listing.photo ? (
        <Image
          source={listing.photo}
          contentFit="cover"
          transition={150}
          accessibilityLabel={listing.title}
          style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 20 }}
        />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Thumb emoji={listing.emoji} size={140} color={CATEGORY_STYLE[listing.category].color} />
        </View>
      )}

      <View style={{ gap: Spacing.one }}>
        <ThemedText type="heading">{listing.title}</ThemedText>
        <ThemedText type="smallBold">
          {peso(listing.dailyPrice)}/day · {listing.minDays}–{listing.maxDays} days
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {listing.area} · {listing.distanceKm.toFixed(1)} km away. The exact meetup spot is agreed after booking.
        </ThemedText>
      </View>

      {!isMine ? (
        <Banner>
          <ThemedText type="small">
            Your deposit: <ThemedText type="smallBold">{peso(deposit)}</ThemedText> ({DEPOSIT_RATE[trustTier(me)] * 100}%
            of the {peso(listing.value)} declared value, {trustTier(me)} tier). It&apos;s returned after the return
            check.
          </ThemedText>
        </Banner>
      ) : null}

      <Section title="About this item">
        <ThemedText type="small">{listing.description}</ThemedText>
        <Card>
          <ThemedText type="smallBold">Known defects</ThemedText>
          <ThemedText type="small">{listing.knownDefects}</ThemedText>
        </Card>
      </Section>

      {listing.powered && listing.safety ? (
        <Section title="Safety checklist">
          <Card>
            <Check ok={listing.safety.powersOn} label="Powers on" />
            <Check ok={listing.safety.cordIntact} label="Cord and plug intact" />
            <Check ok={listing.safety.noExposedWiring} label="No exposed wiring" />
            <Check ok={listing.safety.grounded} label="Grounding OK" />
            {listing.safety.lastCalibration ? (
              <Row label="Last calibration" value={listing.safety.lastCalibration} />
            ) : null}
          </Card>
        </Section>
      ) : null}

      <Section title="Lender">
        <Card>
          <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
            <Avatar name={owner.name} />
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText type="smallBold">{owner.name}</ThemedText>
              {owner.verification === 'verified' ? <Badge label="Verified" tone="tint" /> : null}
            </View>
          </View>
          <Row label="Rating" value={owner.rating > 0 ? `★ ${owner.rating.toFixed(1)}` : 'New'} />
          <Row label="Completed rentals" value={String(owner.completedRentals)} />
          <Row label="Responds" value={owner.responseTime} />
          {listing.matchedDescription > 0 ? (
            <Row label="Matched description" value={`★ ${listing.matchedDescription.toFixed(1)}`} />
          ) : null}
        </Card>
      </Section>
    </Screen>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return <Row label={label} value={ok ? '✓' : '✗'} />;
}
