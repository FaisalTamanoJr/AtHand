import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

type SymbolName = ComponentProps<typeof SymbolView>['name'];
type IosName = Extract<SymbolName, string>;
type MdName = NonNullable<Exclude<SymbolName, string>['android']>;

/** An SF Symbol on iOS and the matching Material Symbol on Android and web. */
export type IconName = { ios: IosName; md: MdName };

export function Icon({
  name,
  size = 22,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SymbolView
      name={{ ios: name.ios, android: name.md, web: name.md }}
      size={size}
      tintColor={color}
      style={[{ width: size, height: size }, style]}
    />
  );
}
