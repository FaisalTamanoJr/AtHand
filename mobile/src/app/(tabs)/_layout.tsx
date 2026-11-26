import { useRouter } from 'expo-router';
import { Tabs, type BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { ACTIVE_STATUSES } from '@/lib/booking-status';
import { useApp } from '@/store/app-store';

const TABS: Record<string, { label: string; icon: IconName; iconActive: IconName }> = {
  index: { label: 'Home', icon: { ios: 'house', md: 'home' }, iconActive: { ios: 'house.fill', md: 'home' } },
  rentals: { label: 'Rentals', icon: { ios: 'calendar', md: 'calendar_month' }, iconActive: { ios: 'calendar', md: 'calendar_month' } },
  inbox: {
    label: 'Inbox',
    icon: { ios: 'bubble.left.and.bubble.right', md: 'chat_bubble' },
    iconActive: { ios: 'bubble.left.and.bubble.right', md: 'chat_bubble' },
  },
  profile: { label: 'Account', icon: { ios: 'person.crop.circle', md: 'account_circle' }, iconActive: { ios: 'person.crop.circle', md: 'account_circle' } },
};

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="rentals" />
      <Tabs.Screen name="inbox" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function TabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state: app, me, listing } = useApp();

  const counts: Record<string, number> = {
    rentals: app.bookings.filter(
      (b) => ACTIVE_STATUSES.includes(b.status) && (b.borrowerId === me.id || listing(b.listingId)?.ownerId === me.id),
    ).length,
    inbox: app.notices.filter((n) => n.userId === me.id).length,
  };

  const tab = (index: number) => {
    const route = state.routes[index];
    const meta = TABS[route.name];
    if (!meta) return null;
    const focused = state.index === index;
    const color = focused ? theme.tint : theme.textSecondary;
    const count = counts[route.name] ?? 0;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={meta.label}
        onPress={() => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        }}
        style={styles.tab}>
        <View>
          <Icon name={focused ? meta.iconActive : meta.icon} size={24} color={color} />
          {count > 0 ? (
            <View style={[styles.count, { backgroundColor: route.name === 'inbox' ? '#EF4444' : theme.tint, borderColor: theme.backgroundElement }]}>
              <ThemedText style={styles.countText}>{count > 9 ? '9+' : count}</ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText type="smallBold" style={{ color, fontSize: 11.5, lineHeight: 15 }}>
          {meta.label}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.backgroundElement,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, 8),
          boxShadow: `0px -4px 16px ${theme.shadow}`,
        },
      ]}>
      {tab(0)}
      {tab(1)}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Rent out an item"
        onPress={() => router.push(me.verification === 'verified' ? '/new-listing' : '/verify')}
        style={styles.tab}>
        <View
          style={[
            styles.fab,
            { backgroundColor: theme.tint, borderColor: theme.backgroundElement, boxShadow: '0px 6px 14px rgba(21, 96, 232, 0.4)' },
          ]}>
          <Icon name={{ ios: 'plus', md: 'add' }} size={30} color="#FFFFFF" />
        </View>
        <ThemedText type="smallBold" style={{ color: theme.tint, fontSize: 11.5, lineHeight: 15 }}>
          Rent Out
        </ThemedText>
      </Pressable>
      {tab(2)}
      {tab(3)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 4,
    marginTop: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: 800,
  },
});
