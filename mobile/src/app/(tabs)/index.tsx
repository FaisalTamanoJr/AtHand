import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { ListingCard } from '@/components/listing-card';
import { ThemedText } from '@/components/themed-text';
import { Badge, Banner, Button, Card, Chip, Field, Screen, Section, Segmented, Thumb, ToggleRow } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { CATEGORIES, type Category } from '@/data/types';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/booking-status';
import { peso } from '@/lib/rules';
import { useApp, type Mode } from '@/store/app-store';

const RADII = [1, 3, 5, 10];

export default function HomeScreen() {
  const { state, me, actions } = useApp();
  return (
    <ScreenWithMode mode={state.mode} onMode={actions.setMode} name={me.name.split(' ')[0]}>
      {state.mode === 'borrow' ? <BorrowView /> : <LendView />}
    </ScreenWithMode>
  );
}

function ScreenWithMode({
  mode,
  onMode,
  name,
  children,
}: {
  mode: Mode;
  onMode: (mode: Mode) => void;
  name: string;
  children: ReactNode;
}) {
  return (
    <Screen tab>
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="heading">AtHand</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Hi {name}! Rent what you need from people nearby.
        </ThemedText>
      </View>
      <Segmented
        value={mode}
        onChange={onMode}
        options={[
          { value: 'borrow', label: 'I Want to Borrow' },
          { value: 'lend', label: 'My Rent Out List' },
        ]}
      />
      {children}
    </Screen>
  );
}

function BorrowView() {
  const { state, me, user } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [radius, setRadius] = useState(5);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const results = state.listings
    .filter((l) => l.ownerId !== me.id)
    .filter((l) => l.distanceKm <= radius)
    .filter((l) => !category || l.category === category)
    .filter((l) => !verifiedOnly || user(l.ownerId)?.verification === 'verified')
    .filter((l) => !query || `${l.title} ${l.category} ${l.description}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <>
      <Field label="Search" placeholder="Calculator, ring light, drill…" value={query} onChangeText={setQuery} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.two }}>
        <Chip label="All" selected={!category} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(category === c ? null : c)} />
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
        <ThemedText type="small" themeColor="textSecondary">
          Within
        </ThemedText>
        {RADII.map((r) => (
          <Chip key={r} label={`${r} km`} selected={radius === r} onPress={() => setRadius(r)} />
        ))}
      </View>
      <ToggleRow label="Verified lenders only" value={verifiedOnly} onChange={setVerifiedOnly} />
      <Section title="Available near you">
        {results.length === 0 ? (
          <Banner tone="neutral">
            <ThemedText type="small">Nothing matches yet. Try a wider radius or another category.</ThemedText>
          </Banner>
        ) : (
          results.map((listing) => <ListingCard key={listing.id} listing={listing} owner={user(listing.ownerId)} />)
        )}
      </Section>
    </>
  );
}

function LendView() {
  const { state, me, user, listing: findListing } = useApp();
  const router = useRouter();
  const mine = state.listings.filter((l) => l.ownerId === me.id);
  const requests = state.bookings.filter(
    (b) => findListing(b.listingId)?.ownerId === me.id && ['requested', 'returned'].includes(b.status),
  );
  const earned = state.bookings
    .filter((b) => b.status === 'completed' && findListing(b.listingId)?.ownerId === me.id)
    .reduce((sum, b) => sum + b.quote.rental, 0);

  return (
    <>
      {me.verification !== 'verified' ? (
        <Banner tone="warning">
          <ThemedText type="smallBold">Verify your ID before listing</ThemedText>
          <ThemedText type="small">
            Lenders verify their ID and payout account once, at their first listing.
          </ThemedText>
          <Button label="Verify now" onPress={() => router.push('/verify')} />
        </Banner>
      ) : (
        <Button label="+ New listing" onPress={() => router.push('/new-listing')} />
      )}

      <Card>
        <ThemedText type="small" themeColor="textSecondary">
          Earned so far
        </ThemedText>
        <ThemedText type="heading">{peso(earned)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          You keep your full price. Borrowers pay the 5% service fee.
        </ThemedText>
      </Card>

      {requests.length > 0 ? (
        <Section title="Needs your action">
          {requests.map((b) => {
            const l = findListing(b.listingId)!;
            return (
              <Card key={b.id} onPress={() => router.push({ pathname: '/rental/[id]', params: { id: b.id } })}>
                <ThemedText type="smallBold">{l.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {user(b.borrowerId)?.name} · {b.days} day{b.days > 1 ? 's' : ''}
                </ThemedText>
                <Badge label={STATUS_LABEL[b.status]} tone={STATUS_TONE[b.status]} />
              </Card>
            );
          })}
        </Section>
      ) : null}

      <Section title={`Your items (${mine.length})`}>
        {mine.length === 0 ? (
          <Banner tone="neutral">
            <ThemedText type="small">You haven&apos;t listed anything yet.</ThemedText>
          </Banner>
        ) : (
          mine.map((l) => (
            <Card key={l.id} onPress={() => router.push({ pathname: '/listing/[id]', params: { id: l.id } })}>
              <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
                <Thumb emoji={l.emoji} size={48} />
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold">{l.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {peso(l.dailyPrice)}/day · value {peso(l.value)}
                  </ThemedText>
                </View>
              </View>
            </Card>
          ))
        )}
      </Section>
    </>
  );
}
