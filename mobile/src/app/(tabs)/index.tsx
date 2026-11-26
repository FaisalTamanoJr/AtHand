import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { ListingTile } from '@/components/listing-card';
import { ThemedText } from '@/components/themed-text';
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  Chip,
  HeroIconButton,
  IconTile,
  LinkButton,
  Screen,
  Section,
  SearchBar,
  Segmented,
  Thumb,
  ToggleRow,
} from '@/components/ui';
import { CATEGORY_STYLE } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { CATEGORIES, type Category } from '@/data/types';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/booking-status';
import { DEPOSIT_RATE, SERVICE_FEE_RATE, peso, trustTier } from '@/lib/rules';
import { useApp } from '@/store/app-store';

const RADII = [1, 3, 5, 10];

export default function HomeScreen() {
  const { state, me, actions } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const unread = state.notices.some((n) => n.userId === me.id);
  const borrowing = state.mode === 'borrow';

  return (
    <Screen
      tab
      hero={
        <>
          <View style={styles.heroTop}>
            <View style={styles.location}>
              <Icon name={{ ios: 'mappin.and.ellipse', md: 'location_on' }} size={20} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.locationLabel}>RENTING NEAR</ThemedText>
                <ThemedText type="smallBold" style={{ color: '#FFFFFF', fontSize: 15 }} numberOfLines={1}>
                  {me.area}
                </ThemedText>
              </View>
            </View>
            <HeroIconButton
              icon={{ ios: 'bell', md: 'notifications' }}
              label="Notifications"
              dot={unread}
              onPress={() => router.push('/inbox')}
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Your profile" onPress={() => router.push('/profile')}>
              <Avatar name={me.name} size={40} ring />
            </Pressable>
          </View>
          <Segmented
            onHero
            value={state.mode}
            onChange={actions.setMode}
            options={[
              { value: 'borrow', label: 'I Want to Borrow', icon: { ios: 'magnifyingglass', md: 'search' } },
              { value: 'lend', label: 'My Rent Out List', icon: { ios: 'tag', md: 'sell' } },
            ]}
          />
          {borrowing ? (
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search calculators, ring lights, drills…"
              onFilter={() => setShowFilters((v) => !v)}
              filterActive={showFilters}
            />
          ) : (
            <ThemedText type="small" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Hi {me.name.split(' ')[0]}! Earn from things you rarely use.
            </ThemedText>
          )}
        </>
      }>
      {borrowing ? <BorrowView query={query} showFilters={showFilters} /> : <LendView />}
    </Screen>
  );
}

function TrustCard() {
  const { me } = useApp();
  const router = useRouter();
  const theme = useTheme();
  const tier = trustTier(me);
  const verified = me.verification === 'verified';
  const actions: { label: string; icon: IconName; onPress: () => void }[] = [
    { label: 'My ID', icon: { ios: 'person.crop.circle', md: 'badge' }, onPress: () => router.push('/profile') },
    { label: `${DEPOSIT_RATE[tier] * 100}% Deposit`, icon: { ios: 'shield.lefthalf.filled', md: 'shield' }, onPress: () => router.push('/profile') },
    { label: 'Rentals', icon: { ios: 'clock', md: 'history' }, onPress: () => router.push('/rentals') },
    { label: 'Messages', icon: { ios: 'bubble.left.and.bubble.right', md: 'chat' }, onPress: () => router.push('/inbox') },
  ];
  return (
    <Card style={{ gap: Spacing.three }}>
      <View style={styles.trustTop}>
        <IconTile icon={{ ios: 'checkmark.seal.fill', md: 'workspace_premium' }} color={theme.tint} size={46} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={{ fontSize: 12, letterSpacing: 0.6 }}>
              TRUST TIER
            </ThemedText>
            <Badge
              label={verified ? 'Verified' : me.verification === 'pending' ? 'Pending' : 'Not verified'}
              tone={verified ? 'tint' : me.verification === 'pending' ? 'warning' : 'danger'}
            />
          </View>
          <ThemedText type="heading" style={{ fontSize: 24, lineHeight: 30 }}>
            {tier}{' '}
            <ThemedText type="small" themeColor="textSecondary">
              ({me.completedRentals} rentals{me.rating > 0 ? ` · ★ ${me.rating.toFixed(1)}` : ''})
            </ThemedText>
          </ThemedText>
        </View>
        {verified ? null : <Button compact variant="secondary" label="Verify" onPress={() => router.push('/verify')} />}
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.quickRow}>
        {actions.map((a) => (
          <Pressable key={a.label} accessibilityRole="button" onPress={a.onPress} style={styles.quick}>
            <View style={[styles.quickIcon, { backgroundColor: theme.backgroundSelected }]}>
              <Icon name={a.icon} size={20} color={theme.text} />
            </View>
            <ThemedText type="small" style={{ fontSize: 12, textAlign: 'center' }} numberOfLines={1}>
              {a.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

function CategoryGrid({ value, onChange }: { value: Category | null; onChange: (c: Category | null) => void }) {
  return (
    <Section title="Categories" action={value ? <LinkButton label="Show all" onPress={() => onChange(null)} /> : undefined}>
      <View style={styles.grid}>
        {CATEGORIES.map((c) => {
          const s = CATEGORY_STYLE[c];
          const selected = value === c;
          return (
            <Pressable
              key={c}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={c}
              onPress={() => onChange(selected ? null : c)}
              style={({ pressed }) => [styles.gridItem, pressed && { opacity: 0.7 }]}>
              <IconTile icon={s.icon} color={s.color} soft={s.soft} size={56} selected={selected} />
              <ThemedText type={selected ? 'smallBold' : 'small'} style={{ fontSize: 12.5 }} numberOfLines={1}>
                {s.short}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </Section>
  );
}

const HIGHLIGHTS = [
  {
    tag: 'Trusted tier',
    title: `Deposits drop to ${DEPOSIT_RATE.Trusted * 100}%`,
    body: 'Finish 5 rentals with a 4.0+ rating to halve your deposit.',
  },
  {
    tag: 'Lenders',
    title: 'Keep 100% of your price',
    body: `Borrowers cover the ${SERVICE_FEE_RATE * 100}% service fee. List something today.`,
  },
  {
    tag: 'Safety',
    title: 'Powered items are checked',
    body: 'Every electrical listing passes a safety checklist first.',
  },
];

function Highlights() {
  const gradients = useGradients();
  const theme = useTheme();
  return (
    <Section title="Highlights">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -Spacing.three }}
        contentContainerStyle={{ gap: Spacing.three, paddingHorizontal: Spacing.three }}>
        {HIGHLIGHTS.map((h, i) => (
          <View
            key={h.tag}
            style={[styles.promo, { backgroundColor: theme.tint, backgroundImage: gradients.promo[i % gradients.promo.length] }]}>
            <View style={[styles.promoTag, { backgroundColor: theme.highlight }]}>
              <ThemedText style={styles.promoTagText}>{h.tag.toUpperCase()}</ThemedText>
            </View>
            <ThemedText type="heading" style={{ color: '#FFFFFF', fontSize: 19, lineHeight: 24 }}>
              {h.title}
            </ThemedText>
            <ThemedText type="small" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {h.body}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </Section>
  );
}

function BorrowView({ query, showFilters }: { query: string; showFilters: boolean }) {
  const { state, me, user } = useApp();
  const theme = useTheme();
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

  const rows: (typeof results)[] = [];
  for (let i = 0; i < results.length; i += 2) rows.push(results.slice(i, i + 2));

  return (
    <>
      {showFilters ? (
        <Card>
          <ThemedText type="smallBold" themeColor="textSecondary" style={{ fontSize: 12, letterSpacing: 0.6 }}>
            DISTANCE
          </ThemedText>
          <View style={{ flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' }}>
            {RADII.map((r) => (
              <Chip key={r} label={`${r} km`} selected={radius === r} onPress={() => setRadius(r)} />
            ))}
          </View>
          <ToggleRow label="Verified lenders only" value={verifiedOnly} onChange={setVerifiedOnly} />
        </Card>
      ) : (
        <TrustCard />
      )}

      <CategoryGrid value={category} onChange={setCategory} />

      {!query && !category ? <Highlights /> : null}

      <Section
        title="Available near you"
        subtitle={verifiedOnly ? 'Verified lenders in your area' : 'Students and neighbours in your area'}
        action={
          <View style={[styles.radiusPill, { backgroundColor: theme.tintSoft }]}>
            <Icon name={{ ios: 'location.fill', md: 'near_me' }} size={13} color={theme.tint} />
            <ThemedText type="smallBold" style={{ color: theme.tint, fontSize: 13 }}>
              {'< '}
              {radius} km
            </ThemedText>
          </View>
        }>
        {results.length === 0 ? (
          <Banner tone="neutral">
            <ThemedText type="small">Nothing matches yet. Try a wider radius or another category.</ThemedText>
          </Banner>
        ) : (
          rows.map((row) => (
            <View key={row[0].id} style={{ flexDirection: 'row', gap: Spacing.three }}>
              {row.map((listing) => (
                <ListingTile key={listing.id} listing={listing} owner={user(listing.ownerId)} />
              ))}
              {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
            </View>
          ))
        )}
      </Section>
    </>
  );
}

function LendView() {
  const { state, me, user, listing: findListing } = useApp();
  const router = useRouter();
  const theme = useTheme();
  const mine = state.listings.filter((l) => l.ownerId === me.id);
  const requests = state.bookings.filter(
    (b) => findListing(b.listingId)?.ownerId === me.id && ['requested', 'returned'].includes(b.status),
  );
  const earned = state.bookings
    .filter((b) => b.status === 'completed' && findListing(b.listingId)?.ownerId === me.id)
    .reduce((sum, b) => sum + b.quote.rental, 0);
  const verified = me.verification === 'verified';

  return (
    <>
      <Card style={{ gap: Spacing.three }}>
        <View style={styles.trustTop}>
          <IconTile icon={{ ios: 'creditcard', md: 'payments' }} color={theme.success} size={46} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={{ fontSize: 12, letterSpacing: 0.6 }}>
                EARNED SO FAR
              </ThemedText>
              <Badge label="You keep 100%" tone="success" />
            </View>
            <ThemedText type="heading" style={{ fontSize: 26, lineHeight: 32 }}>
              {peso(earned)}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          Borrowers pay the {SERVICE_FEE_RATE * 100}% service fee, so your full price goes to you.
        </ThemedText>
        {verified ? (
          <Button label="New listing" icon={{ ios: 'plus', md: 'add' }} onPress={() => router.push('/new-listing')} />
        ) : null}
      </Card>

      {!verified ? (
        <Banner tone="warning">
          <ThemedText type="smallBold">Verify your ID before listing</ThemedText>
          <ThemedText type="small">Lenders verify their ID and payout account once, at their first listing.</ThemedText>
          <Button label="Verify now" onPress={() => router.push('/verify')} />
        </Banner>
      ) : null}

      {requests.length > 0 ? (
        <Section title="Needs your action">
          {requests.map((b) => {
            const l = findListing(b.listingId)!;
            return (
              <Card key={b.id} onPress={() => router.push({ pathname: '/rental/[id]', params: { id: b.id } })}>
                <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
                  <Thumb emoji={l.emoji} photo={l.photo} size={48} color={CATEGORY_STYLE[l.category].color} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText type="smallBold">{l.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {user(b.borrowerId)?.name} · {b.days} day{b.days > 1 ? 's' : ''}
                    </ThemedText>
                    <Badge label={STATUS_LABEL[b.status]} tone={STATUS_TONE[b.status]} />
                  </View>
                  <Icon name={{ ios: 'chevron.right', md: 'chevron_right' }} size={18} color={theme.textSecondary} />
                </View>
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
                <Thumb emoji={l.emoji} photo={l.photo} size={48} color={CATEGORY_STYLE[l.category].color} />
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold">{l.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    <ThemedText type="smallBold" themeColor="tint">
                      {peso(l.dailyPrice)}/day
                    </ThemedText>{' '}
                    · value {peso(l.value)}
                  </ThemedText>
                </View>
                <Icon name={{ ios: 'chevron.right', md: 'chevron_right' }} size={18} color={theme.textSecondary} />
              </View>
            </Card>
          ))
        )}
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: 700,
    letterSpacing: 0.6,
  },
  trustTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  divider: {
    height: 1,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quick: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.three,
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    gap: 6,
  },
  promo: {
    width: 290,
    borderRadius: 20,
    padding: Spacing.three,
    gap: 6,
  },
  promoTag: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 2,
  },
  promoTagText: {
    color: '#1F2937',
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  radiusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
