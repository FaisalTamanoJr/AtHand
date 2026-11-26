import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/icon';
import { Avatar, Banner, Card, HeroTitle, IconTile, Screen, Section } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { shortDate } from '@/lib/rules';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/app-store';

export default function InboxScreen() {
  const { state, me, listing, user } = useApp();
  const router = useRouter();
  const theme = useTheme();

  const notices = state.notices.filter((n) => n.userId === me.id);
  const threads = state.bookings
    .filter((b) => b.borrowerId === me.id || listing(b.listingId)?.ownerId === me.id)
    .map((b) => {
      const item = listing(b.listingId)!;
      const otherId = b.borrowerId === me.id ? item.ownerId : b.borrowerId;
      const messages = state.messages.filter((m) => m.threadId === b.id);
      return { booking: b, item, other: user(otherId)!, last: messages[messages.length - 1] };
    })
    .filter((t) => t.last);

  return (
    <Screen tab hero={<HeroTitle title="Inbox" subtitle={`${notices.length} notifications · ${threads.length} chats`} />}>
      <Section title="Notifications">
        {notices.length === 0 ? (
          <Banner tone="neutral">
            <ThemedText type="small">You&apos;re all caught up.</ThemedText>
          </Banner>
        ) : (
          notices.map((n) => (
            <Card
              key={n.id}
              onPress={
                n.bookingId ? () => router.push({ pathname: '/rental/[id]', params: { id: n.bookingId! } }) : undefined
              }>
              <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
                <IconTile icon={{ ios: 'bell', md: 'notifications' }} color={theme.tint} size={40} />
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText type="small">{n.text}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }}>
                    {shortDate(n.at)}
                  </ThemedText>
                </View>
              </View>
            </Card>
          ))
        )}
      </Section>
      <Section title="Messages">
        {threads.length === 0 ? (
          <Banner tone="neutral">
            <ThemedText type="small">No conversations yet.</ThemedText>
          </Banner>
        ) : (
          threads.map((t) => (
            <Card key={t.booking.id} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: t.booking.id } })}>
              <View style={{ flexDirection: 'row', gap: Spacing.three, alignItems: 'center' }}>
                <Avatar name={t.other.name} />
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold">
                    {t.other.name} · {t.item.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                    {t.last!.text}
                  </ThemedText>
                </View>
                <Icon name={{ ios: 'chevron.right', md: 'chevron_right' }} size={18} color={theme.textSecondary} />
              </View>
            </Card>
          ))
        )}
      </Section>
    </Screen>
  );
}
