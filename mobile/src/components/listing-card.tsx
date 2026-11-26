import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge, Card, Thumb } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Listing, User } from '@/data/types';
import { peso } from '@/lib/rules';

export function ListingCard({ listing, owner }: { listing: Listing; owner?: User }) {
  const router = useRouter();
  return (
    <Card onPress={() => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })}>
      <View style={{ flexDirection: 'row', gap: Spacing.three }}>
        <Thumb emoji={listing.emoji} />
        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText type="smallBold" numberOfLines={2}>
            {listing.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {listing.area} · {listing.distanceKm.toFixed(1)} km
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: 2 }}>
            <ThemedText type="smallBold">{peso(listing.dailyPrice)}/day</ThemedText>
            {listing.rating > 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                ★ {listing.rating.toFixed(1)}
              </ThemedText>
            ) : null}
            {owner?.verification === 'verified' ? <Badge label="Verified lender" tone="tint" /> : null}
          </View>
        </View>
      </View>
    </Card>
  );
}
