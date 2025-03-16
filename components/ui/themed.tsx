/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Pressable,
  ActivityIndicator,
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  TouchableNativeFeedback as DefaultButton,
} from "react-native";

import Colors from "@/constants/colors";
import { useColorScheme } from "../../hooks/use-color-scheme";

type ThemeProps = {
  darkColor?: string;
  lightColor?: string;
};

type TextfieldProps = {
  error?: string | undefined;
};

type ButtonProps = {
  title: string;
  isLoading?: boolean;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type AppButtonProps = ThemeProps & ButtonProps & DefaultButton["props"];
export type TextInputProps = ThemeProps & TextfieldProps & DefaultTextInput["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[style, { color }]} {...otherProps} />;
}

export function ErrorText(props: TextProps) {
  const { className, ...otherProps } = props;
  return <DefaultText className={`${className} text-sm text-red-500 tracking-wide`} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <DefaultView style={[style, { backgroundColor }]} {...otherProps} />;
}

export function ShadowView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const shadowColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const shadowStyle = {
    shadowColor,
    elevation: 6,
    shadowRadius: 4.65,
    shadowOpacity: 0.27,
    shadowOffset: { width: 0, height: 3 },
  };
  return <DefaultView style={[shadowStyle, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, error, lightColor, className, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "secondaryBackground");

  return (
    <View className="mx-6 my-3">
      <DefaultTextInput
        style={[style, { backgroundColor }]}
        {...otherProps}
        className={`${className} px-4 py-5 border border-black/25 dark:border-white/25 rounded-xl placeholder:text-gray-400 placeholder:tracking-wider dark:text-white`}
      />
      {error && <ErrorText className="mt-1.5 ml-1">{error}</ErrorText>}
    </View>
  );
}

export function AppButton(props: AppButtonProps) {
  const { style, lightColor, darkColor, title, isLoading, className, ...otherProps } = props;
  return (
    <Pressable {...otherProps}>
      <DefaultView className="bg-app-blue mx-6 mt-3 p-4 self-stretch min-h-16 rounded-xl items-center justify-center">
        {isLoading ? (
          <ActivityIndicator color="white" size={25} />
        ) : (
          <DefaultText className="text-white text-lg font-bold tracking-widest">{title}</DefaultText>
        )}
      </DefaultView>
    </Pressable>
  );
}
