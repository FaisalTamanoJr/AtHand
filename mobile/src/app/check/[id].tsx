import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Banner, Button, Card, Screen, Section, Thumb, ToggleRow } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { CheckKind } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/app-store';

const PHOTO_SLOTS = ['Front', 'Back', 'Close-up of any defects'];
const POWERED_CHECKS = ['Powers on', 'Cord and plug intact', 'No exposed wiring', 'Grounding OK'];
const BASIC_CHECKS = ['All parts included', 'No new damage'];

export default function CheckScreen() {
  const { id, kind = 'pickup' } = useLocalSearchParams<{ id: string; kind?: CheckKind }>();
  const { booking: findBooking, listing: findListing, actions } = useApp();
  const router = useRouter();
  const theme = useTheme();
  const booking = findBooking(id);
  const listing = booking ? findListing(booking.listingId) : undefined;

  const items = [...(listing?.powered ? POWERED_CHECKS : []), ...BASIC_CHECKS];
  const [photos, setPhotos] = useState<boolean[]>(PHOTO_SLOTS.map(() => false));
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [matches, setMatches] = useState(false);

  if (!booking || !listing) {
    return (
      <Screen>
        <ThemedText>This rental no longer exists.</ThemedText>
      </Screen>
    );
  }

  const allPhotos = photos.every(Boolean);
  const allChecked = items.every((i) => checked[i]);
  const ready = allPhotos && allChecked && (kind === 'return' || matches);

  const submit = () => {
    actions.recordCheck(booking.id, kind, {
      photos: photos.length,
      checklist: items,
      serverTime: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <Screen footer={<Button label={kind === 'pickup' ? 'Confirm pickup' : 'Confirm return'} disabled={!ready} onPress={submit} />}>
      <ThemedText type="heading">
        {kind === 'pickup' ? 'Pickup' : 'Return'} check · {listing.title}
      </ThemedText>

      <Section title="Photos">
        <ThemedText type="small" themeColor="textSecondary">
          Taken with the in-app camera only, no gallery uploads. Each photo is stamped with the server time when it
          uploads. With no signal, photos upload later.
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {PHOTO_SLOTS.map((slot, i) => (
            <Pressable
              key={slot}
              accessibilityRole="button"
              accessibilityLabel={`Take ${slot} photo`}
              onPress={() => setPhotos(photos.map((p, j) => (j === i ? true : p)))}
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                padding: Spacing.one,
                backgroundColor: photos[i] ? theme.tintSoft : theme.backgroundElement,
              }}>
              {photos[i] ? (
                <Thumb emoji={listing.emoji} photo={listing.photo} size={44} />
              ) : (
                <ThemedText style={{ fontSize: 28, lineHeight: 36 }}>📸</ThemedText>
              )}
              <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', fontSize: 11, lineHeight: 14 }}>
                {photos[i] ? 'Captured' : slot}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title="Checklist">
        <Card>
          {items.map((item) => (
            <ToggleRow key={item} label={item} value={Boolean(checked[item])} onChange={(v) => setChecked({ ...checked, [item]: v })} />
          ))}
        </Card>
      </Section>

      {kind === 'pickup' ? (
        <Card>
          <ToggleRow label="The item matches the listing (borrower)" value={matches} onChange={setMatches} />
        </Card>
      ) : (
        <Banner tone="neutral">
          <ThemedText type="small">
            After this, the lender has 48 hours to confirm or flag damage. Support compares these photos with the pickup
            photos if there&apos;s a dispute.
          </ThemedText>
        </Banner>
      )}
    </Screen>
  );
}
