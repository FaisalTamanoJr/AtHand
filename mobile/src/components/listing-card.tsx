import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Badge, Card, Thumb, useCardShadow } from '@/components/ui';
import { CATEGORY_STYLE } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import type { Listing, User } from '@/data/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { peso } from '@/lib/rules';

export function ListingCard({ listing, owner }: { listing: Listing; owner?: User }) {
  const router = useRouter();
  return (
    <Card onPress={() => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })}>
      <View style={{ flexDirection: 'row', gap: Spacing.three }}>
        <Thumb emoji={listing.emoji} photo={listing.photo} color={CATEGORY_STYLE[listing.category].color} />
        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText type="smallBold" numberOfLines={2}>
            {listing.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {listing.area} · {listing.distanceKm.toFixed(1)} km
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: 2 }}>
            <ThemedText type="smallBold" themeColor="tint">
              {peso(listing.dailyPrice)}/day
            </ThemedText>
            {listing.rating > 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                ★ {listing.rating.toFixed(1)}
              </ThemedText>
            ) : null}
            {owner?.verification === 'verified' ? <Badge label="Verified" tone="tint" /> : null}
          </View>
        </View>
      </View>
    </Card>
  );
}

/** Two-column grid card for the home feed: pastel image area on top, details below. */
export function ListingTile({ listing, owner }: { listing: Listing; owner?: User }) {
  const router = useRouter();
  const theme = useTheme();
  const scheme = useColorScheme();
  const shadow = useCardShadow();
  const style = CATEGORY_STYLE[listing.category];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        shadow,
        pressed && { opacity: 0.85 },
      ]}>
      <View style={[styles.image, { backgroundColor: scheme === 'dark' ? `${style.color}26` : style.soft }]}>
        {listing.photo ? (
          <Image source={listing.photo} contentFit="cover" transition={150} style={StyleSheet.absoluteFill} />
        ) : (
          <ThemedText style={{ fontSize: 44, lineHeight: 56 }}>{listing.emoji}</ThemedText>
        )}
        {owner?.verification === 'verified' ? (
          <View style={[styles.tag, { backgroundColor: theme.backgroundElement }]}>
            <Icon name={{ ios: 'checkmark.seal.fill', md: 'verified_user' }} size={12} color={theme.tint} />
            <ThemedText style={[styles.tagText, { color: theme.text }]}>Verified</ThemedText>
          </View>
        ) : null}
      </View>
      <View style={{ padding: 10, paddingTop: Spacing.two, gap: 2 }}>
        <ThemedText type="smallBold" numberOfLines={2} style={{ minHeight: 40 }}>
          {listing.title}
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Icon name={{ ios: 'location.fill', md: 'near_me' }} size={12} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={{ fontSize: 12, flex: 1 }}>
            {listing.distanceKm.toFixed(1)} km · {listing.area}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
          <ThemedText type="smallBold" themeColor="tint" style={{ fontSize: 15 }}>
            {peso(listing.dailyPrice)}
            <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }}>
              /day
            </ThemedText>
          </ThemedText>
          {listing.rating > 0 ? (
            <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }}>
              ★ {listing.rating.toFixed(1)}
            </ThemedText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    margin: 6,
    marginBottom: 0,
    height: 104,
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: 700,
  },
});
