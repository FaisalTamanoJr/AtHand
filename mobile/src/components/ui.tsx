import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGradients, useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  /** Tab screens have no stack header, so they pad for the status bar themselves. */
  tab?: boolean;
  /** Content for the blue header at the top of the screen. It pads for the status bar. */
  hero?: ReactNode;
  footer?: ReactNode;
};

export function Screen({ children, tab, hero, footer }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentInsetAdjustmentBehavior={hero ? 'never' : 'automatic'}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={tab && { paddingBottom: BottomTabInset + Spacing.four }}>
        {hero ? <Hero>{hero}</Hero> : null}
        <View style={[styles.screen, tab && !hero && { paddingTop: insets.top + Spacing.three }]}>{children}</View>
      </ScrollView>
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: theme.border,
              backgroundColor: theme.backgroundElement,
              paddingBottom: insets.bottom + Spacing.three,
            },
          ]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

/** The blue gradient band with rounded bottom corners that tops the tab screens. */
export function Hero({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.hero,
        { backgroundColor: theme.tint, backgroundImage: gradients.hero, paddingTop: insets.top + Spacing.three },
      ]}>
      {children}
    </View>
  );
}

/** Title and subtitle in white, for use inside `Hero`. */
export function HeroTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText type="heading" style={{ color: '#FFFFFF', fontSize: 26, lineHeight: 32 }}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={{ color: 'rgba(255,255,255,0.78)' }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Round translucent button for the hero, e.g. the notification bell. */
export function HeroIconButton({
  icon,
  onPress,
  dot,
  label,
}: {
  icon: IconName;
  onPress: () => void;
  dot?: boolean;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.heroIcon, pressed && { opacity: 0.7 }]}>
      <Icon name={icon} size={20} color="#FFFFFF" />
      {dot ? <View style={styles.heroDot} /> : null}
    </Pressable>
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onFilter,
  filterActive,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onFilter?: () => void;
  filterActive?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.search, { backgroundColor: theme.backgroundElement }]}>
      <Icon name={{ ios: 'magnifyingglass', md: 'search' }} size={20} color={theme.textSecondary} />
      <TextInput
        accessibilityLabel="Search"
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        style={{ flex: 1, color: theme.text, fontSize: 15, paddingVertical: 12 }}
      />
      {onFilter ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filters"
          accessibilityState={{ expanded: filterActive }}
          onPress={onFilter}
          style={[styles.filterButton, { backgroundColor: filterActive ? theme.tint : theme.tintSoft }]}>
          <Icon name={{ ios: 'slider.horizontal.3', md: 'tune' }} size={18} color={filterActive ? theme.onTint : theme.tint} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function useCardShadow(): ViewStyle {
  const theme = useTheme();
  return { boxShadow: `0px 4px 16px ${theme.shadow}` };
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const theme = useTheme();
  const shadow = useCardShadow();
  const cardStyle = [styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, shadow, style];
  if (!onPress) return <View style={cardStyle}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [cardStyle, pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] }]}>
      {children}
    </Pressable>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: IconName;
  compact?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled, icon, compact }: ButtonProps) {
  const theme = useTheme();
  const background = variant === 'primary' ? theme.tint : variant === 'danger' ? theme.dangerSoft : theme.tintSoft;
  const color = variant === 'primary' ? theme.onTint : variant === 'danger' ? theme.danger : theme.tint;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        { backgroundColor: background, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        variant === 'primary' && !disabled && { boxShadow: '0px 6px 14px rgba(21, 96, 232, 0.28)' },
      ]}>
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <ThemedText type="smallBold" style={{ color, textAlign: 'center' }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

type Tone = 'neutral' | 'tint' | 'success' | 'warning' | 'danger';

function useToneColors(): Record<Tone, [string, string]> {
  const theme = useTheme();
  return {
    neutral: [theme.backgroundSelected, theme.textSecondary],
    tint: [theme.tintSoft, theme.tint],
    success: [theme.successSoft, theme.success],
    warning: [theme.warningSoft, theme.warning],
    danger: [theme.dangerSoft, theme.danger],
  };
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const [background, color] = useToneColors()[tone];
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <ThemedText style={[styles.badgeText, { color }]}>{label.toUpperCase()}</ThemedText>
    </View>
  );
}

export function Banner({ children, tone = 'tint' }: { children: ReactNode; tone?: Tone }) {
  const theme = useTheme();
  const [soft] = useToneColors()[tone];
  const background = tone === 'neutral' ? theme.backgroundElement : soft;
  return (
    <View style={[styles.banner, { backgroundColor: background, borderColor: tone === 'neutral' ? theme.border : 'transparent' }]}>
      {children}
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.tint : theme.backgroundElement,
          borderColor: selected ? theme.tint : theme.border,
        },
      ]}>
      <ThemedText type="smallBold" style={{ color: selected ? theme.onTint : theme.text, fontSize: 13 }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  onHero,
}: {
  options: { value: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (value: T) => void;
  /** Style for the blue hero: white selected pill on a translucent track. */
  onHero?: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.segmented,
        onHero
          ? { backgroundColor: 'rgba(255,255,255,0.14)' }
          : { backgroundColor: theme.backgroundElement, borderWidth: 1, borderColor: theme.border },
      ]}>
      {options.map((option) => {
        const selected = option.value === value;
        const color = onHero ? (selected ? theme.tint : '#FFFFFF') : selected ? theme.onTint : theme.textSecondary;
        const background = selected ? (onHero ? '#FFFFFF' : theme.tint) : 'transparent';
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, { backgroundColor: background }]}>
            {option.icon ? <Icon name={option.icon} size={17} color={color} /> : null}
            <ThemedText type="smallBold" style={{ color, textAlign: 'center' }} numberOfLines={1}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <ThemedText type={bold ? 'smallBold' : 'small'} themeColor={bold ? 'text' : 'textSecondary'}>
        {label}
      </ThemedText>
      <ThemedText type={bold ? 'smallBold' : 'small'}>{value}</ThemedText>
    </View>
  );
}

export function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <ThemedText type="small" style={{ flex: 1 }}>
        {label}
      </ThemedText>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: theme.tint }} accessibilityLabel={label} />
    </View>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const theme = useTheme();
  return (
    <View style={{ gap: Spacing.one }}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        {...props}
        style={[
          styles.input,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text },
          props.style,
        ]}
      />
    </View>
  );
}

/** Uppercase muted label like "CATEGORIES"; with a subtitle it becomes a large bold heading instead. */
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, gap: 2 }}>
        {subtitle ? (
          <>
            <ThemedText type="heading" style={{ fontSize: 20, lineHeight: 26 }}>
              {title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {subtitle}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
            {title.toUpperCase()}
          </ThemedText>
        )}
      </View>
      {action}
    </View>
  );
}

export function Section({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <View style={{ gap: Spacing.two + 2 }}>
      <SectionHeader title={title} subtitle={subtitle} action={action} />
      {children}
    </View>
  );
}

/** Blue text button for section headers, e.g. "View all". */
export function LinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
      <ThemedText type="smallBold" style={{ color: theme.tint }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

/** Rounded pastel square holding an icon, as used for categories and quick actions. */
export function IconTile({
  icon,
  color,
  soft,
  size = 52,
  selected,
}: {
  icon: IconName;
  color: string;
  soft?: string;
  size?: number;
  selected?: boolean;
}) {
  const scheme = useColorScheme();
  const background = scheme === 'dark' || !soft ? `${color}26` : soft;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: selected ? color : 'transparent',
      }}>
      <Icon name={icon} size={size * 0.46} color={color} />
    </View>
  );
}

/** An item's photo, or its emoji on a pastel square when it has no photo. */
export function Thumb({ emoji, photo, size = 64, color }: { emoji: string; photo?: number; size?: number; color?: string }) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const background = color ? (scheme === 'dark' ? `${color}26` : `${color}1A`) : theme.tintSoft;
  if (photo) {
    return (
      <Image
        source={photo}
        contentFit="cover"
        transition={150}
        style={{ width: size, height: size, borderRadius: size / 4, backgroundColor: background }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ThemedText style={{ fontSize: size * 0.5, lineHeight: size * 0.65 }}>{emoji}</ThemedText>
    </View>
  );
}

export function Avatar({ name, size = 40, ring }: { name: string; size?: number; ring?: boolean }) {
  const theme = useTheme();
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: ring ? 'rgba(255,255,255,0.18)' : theme.tint,
        borderWidth: ring ? 2 : 0,
        borderColor: 'rgba(255,255,255,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ThemedText type="smallBold" style={{ color: theme.onTint, fontSize: size * 0.36 }}>
        {initials}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  hero: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: Spacing.three,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FF4D4F',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 6,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
  },
  buttonCompact: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  banner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 0.8,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
  },
});
