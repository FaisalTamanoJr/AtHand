import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Banner, Button, Card, Chip, Field, Screen, Section, ToggleRow } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { CATEGORIES, type Category } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { MAX_ITEM_VALUE, peso } from '@/lib/rules';
import { useApp } from '@/store/app-store';

const EMOJI: Record<Category, string> = {
  'Lab gear': '🥼',
  Calculators: '🧮',
  'Cameras & lighting': '📷',
  Audio: '🎧',
  Costumes: '👗',
  Kitchenware: '🍳',
  Electronics: '🔌',
  Tools: '🛠️',
};

const SAFETY = ['Powers on', 'Cord and plug intact', 'No exposed wiring', 'Grounding OK'] as const;

const toNumber = (text: string) => Number(text.replace(/[^0-9]/g, '')) || 0;

export default function NewListingScreen() {
  const { me, actions } = useApp();
  const router = useRouter();
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Tools');
  const [description, setDescription] = useState('');
  const [knownDefects, setKnownDefects] = useState('');
  const [value, setValue] = useState('');
  const [price, setPrice] = useState('');
  const [minDays, setMinDays] = useState('1');
  const [maxDays, setMaxDays] = useState('7');
  const [photos, setPhotos] = useState(0);
  const [powered, setPowered] = useState(false);
  const [safety, setSafety] = useState<Record<string, boolean>>({});
  const [calibration, setCalibration] = useState('');

  const declared = toNumber(value);
  const problems = [
    !title.trim() && 'Add a title.',
    photos < 3 && 'Take at least 3 photos.',
    !description.trim() && 'Add a description.',
    !knownDefects.trim() && 'List known defects, or write "None".',
    declared <= 0 && 'Enter the declared item value.',
    declared > MAX_ITEM_VALUE && `Items above ${peso(MAX_ITEM_VALUE)} can't be listed in the pilot.`,
    toNumber(price) <= 0 && 'Set a daily price.',
    toNumber(minDays) > toNumber(maxDays) && 'Minimum days must not exceed maximum days.',
    powered && !SAFETY.every((s) => safety[s]) && 'Powered items must pass every safety check.',
  ].filter(Boolean) as string[];

  const publish = () => {
    actions.addListing({
      title: title.trim(),
      category,
      emoji: EMOJI[category],
      description: description.trim(),
      knownDefects: knownDefects.trim(),
      value: declared,
      dailyPrice: toNumber(price),
      minDays: Math.max(1, toNumber(minDays)),
      maxDays: Math.max(1, toNumber(maxDays)),
      area: me.area,
      powered,
      safety: powered
        ? { powersOn: true, cordIntact: true, noExposedWiring: true, grounded: true, lastCalibration: calibration || undefined }
        : undefined,
    });
    router.back();
  };

  return (
    <Screen footer={<Button label="Publish listing" disabled={problems.length > 0} onPress={publish} />}>
      <Section title={`Photos (${photos}/3 minimum)`}>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {[0, 1, 2, 3].map((i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={`Photo ${i + 1}`}
              onPress={() => setPhotos(Math.max(photos, i + 1))}
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: i < photos ? theme.tintSoft : theme.backgroundElement,
              }}>
              <ThemedText style={{ fontSize: 26, lineHeight: 34 }}>{i < photos ? EMOJI[category] : '＋'}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Section>

      <Field label="Title" placeholder="e.g. Cordless drill set" value={title} onChangeText={setTitle} />

      <Section title="Category">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.two }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>
      </Section>

      <Field label="Description" multiline value={description} onChangeText={setDescription} placeholder="What's included?" />
      <Field label="Known defects" value={knownDefects} onChangeText={setKnownDefects} placeholder='e.g. Scratch on the side, or "None"' />
      <Field
        label={`Declared value (max ${peso(MAX_ITEM_VALUE)})`}
        keyboardType="number-pad"
        value={value}
        onChangeText={setValue}
        placeholder="₱"
      />
      <Field label="Daily price" keyboardType="number-pad" value={price} onChangeText={setPrice} placeholder="₱ per day" />
      <View style={{ flexDirection: 'row', gap: Spacing.two }}>
        <View style={{ flex: 1 }}>
          <Field label="Min days" keyboardType="number-pad" value={minDays} onChangeText={setMinDays} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Max days" keyboardType="number-pad" value={maxDays} onChangeText={setMaxDays} />
        </View>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Pickup area: {me.area}. Borrowers see only this area until a booking is confirmed.
      </ThemedText>

      <Card>
        <ToggleRow label="Powered or electrical item" value={powered} onChange={setPowered} />
        {powered ? (
          <>
            <ThemedText type="small" themeColor="textSecondary">
              Required safety checklist
            </ThemedText>
            {SAFETY.map((s) => (
              <ToggleRow key={s} label={s} value={Boolean(safety[s])} onChange={(v) => setSafety({ ...safety, [s]: v })} />
            ))}
            <Field label="Last calibration (if relevant)" value={calibration} onChangeText={setCalibration} placeholder="e.g. Aug 2026" />
          </>
        ) : null}
      </Card>

      {problems.length > 0 ? (
        <Banner tone="neutral">
          {problems.map((p) => (
            <ThemedText key={p} type="small">
              • {p}
            </ThemedText>
          ))}
        </Banner>
      ) : null}
    </Screen>
  );
}
