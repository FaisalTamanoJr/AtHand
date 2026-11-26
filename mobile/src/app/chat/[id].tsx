import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Banner, Button, Field, Screen } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { looksLikeScam } from '@/lib/rules';
import { useApp } from '@/store/app-store';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, me, actions, booking: findBooking, listing: findListing, user } = useApp();
  const theme = useTheme();
  const [draft, setDraft] = useState('');

  const booking = findBooking(id);
  const listing = booking ? findListing(booking.listingId) : undefined;
  if (!booking || !listing) {
    return (
      <Screen>
        <ThemedText>This conversation no longer exists.</ThemedText>
      </Screen>
    );
  }
  const otherId = booking.borrowerId === me.id ? listing.ownerId : booking.borrowerId;
  const other = user(otherId);
  const messages = state.messages.filter((m) => m.threadId === booking.id);

  const send = () => {
    if (!draft.trim()) return;
    actions.sendMessage(booking.id, draft.trim());
    setDraft('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: other?.name ?? 'Chat' }} />
      <Screen
        footer={
          <>
            {looksLikeScam(draft) ? <ScamWarning /> : null}
            <Field label="Message" placeholder="Write a message…" value={draft} onChangeText={setDraft} />
            <Button label="Send" disabled={!draft.trim()} onPress={send} />
          </>
        }>
        <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
          About: {listing.title}
        </ThemedText>
        {messages.map((m) => {
          const mine = m.fromId === me.id;
          return (
            <View key={m.id} style={{ alignItems: mine ? 'flex-end' : 'flex-start', gap: Spacing.one }}>
              <View
                style={{
                  maxWidth: '80%',
                  borderRadius: 16,
                  padding: Spacing.two + 4,
                  backgroundColor: mine ? theme.tint : theme.backgroundElement,
                }}>
                <ThemedText type="small" style={{ color: mine ? theme.onTint : theme.text }}>
                  {m.text}
                </ThemedText>
              </View>
              {!mine && looksLikeScam(m.text) ? <ScamWarning /> : null}
            </View>
          );
        })}
      </Screen>
    </KeyboardAvoidingView>
  );
}

function ScamWarning() {
  return (
    <Banner tone="danger">
      <ThemedText type="small">
        Heads up: this looks like a phone number, link or request to pay outside AtHand. Payments outside the app
        aren&apos;t protected by the deposit or disputes.
      </ThemedText>
    </Banner>
  );
}
