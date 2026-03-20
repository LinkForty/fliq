import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { getSettings, saveSettings } from '@/lib/settings';
import { trackEvent } from '@/lib/sdk';
import { registerForPushNotifications, registerDevice } from '@/lib/push';
import { useTheme } from '@/lib/theme';

const PUSH_STEP = 2;
const PROFILE_STEP = 4;
const TOTAL_STEPS = 5;

const STEPS = [
  {
    emoji: '🤫',
    title: 'Your secrets. Delivered.',
    body: 'Send secret messages that only the recipient can reveal. No accounts, no trace, pure privacy.',
  },
  {
    emoji: '🫰',
    title: 'Flick to reveal',
    body: "Give your phone a quick flick to unveil secret messages. It's the Fliq way — physical gestures for digital secrets.",
  },
  {
    emoji: '🔔',
    title: 'Push to phone',
    body: 'Send secrets directly to a phone number via push notification. No links, no chat history, no trace. Enable notifications to receive secrets too.',
  },
  {
    emoji: '🔒',
    title: 'Ephemeral by design',
    body: "Messages vanish after reading. Your secrets are encrypted end-to-end — not even Fliq can read them. Delete messages anytime, or let the app auto-delete.",
  },
  {
    emoji: '👋',
    title: 'Set up your profile',
    body: 'Just a name and phone number so friends can send you secrets.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const nameInputRef = useRef<TextInput>(null);

  const isLastStep = step === PROFILE_STEP;
  const isPushStep = step === PUSH_STEP;
  const current = STEPS[step];

  async function handleEnablePush() {
    const result = await registerForPushNotifications();
    if (result.token) {
      setPushToken(result.token);
      setPushEnabled(true);
    } else {
      Alert.alert('Notifications Unavailable', result.error);
    }
  }

  async function handleNext() {
    if (isLastStep) {
      if (!name.trim()) {
        Alert.alert('Enter your name', 'We need a name to get started!');
        return;
      }
      if (!phone.trim() || phone.trim().length < 7) {
        Alert.alert('Enter your phone number', 'We need your phone number so friends can send you secrets.');
        return;
      }

      const settings = await getSettings();
      await saveSettings({
        ...settings,
        userName: name.trim(),
        phoneNumber: phone.trim(),
        onboardingComplete: true,
      });

      if (pushToken) {
        const registered = await registerDevice(phone.trim());
        if (registered) {
          const s = await getSettings();
          await saveSettings({ ...s, pushRegistered: true });
        }
      }

      trackEvent('onboarding_completed', { userName: name.trim(), hasPush: pushEnabled });
      router.replace('/');
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
    >
      <View className="flex-1 justify-between px-8 pt-24 pb-12">
        {/* Content */}
        <Animated.View
          key={step}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(200)}
          className="flex-1 justify-center items-center"
        >
          <View
            className="w-28 h-28 rounded-full items-center justify-center mb-8"
            style={{
              backgroundColor: colors.accentBg,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              ...(colors.isDark
                ? {
                    shadowColor: colors.accent,
                    shadowOpacity: 0.3,
                    shadowRadius: 30,
                    shadowOffset: { width: 0, height: 0 },
                  }
                : {}),
            }}
          >
            <Text style={{ fontSize: 56, lineHeight: 68 }}>{current.emoji}</Text>
          </View>
          <Text
            className="text-3xl font-extrabold text-center mb-4"
            style={{ color: colors.textPrimary }}
          >
            {current.title}
          </Text>
          <Text
            className="text-base text-center leading-relaxed px-4"
            style={{ color: colors.textSecondary }}
          >
            {current.body}
          </Text>

          {/* Enable push button on push step */}
          {isPushStep && (
            <View className="w-full mt-8">
              {pushEnabled ? (
                <View className="flex-row items-center justify-center py-3">
                  <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors.accent }}
                  />
                  <Text style={{ color: colors.accent }} className="font-semibold">
                    Notifications enabled
                  </Text>
                </View>
              ) : (
                <Pressable
                  onPress={handleEnablePush}
                  className="w-full rounded-xl py-4 items-center active:opacity-80"
                  style={
                    colors.isDark
                      ? {
                          ...colors.bgCard,
                          borderWidth: 1,
                          borderColor: colors.accentBorder,
                        }
                      : {
                          backgroundColor: colors.accent,
                        }
                  }
                >
                  <Text
                    className="font-semibold text-base"
                    style={{
                      color: colors.isDark ? colors.accent : colors.accentText,
                    }}
                  >
                    Enable Notifications
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Profile inputs on last step */}
          {isLastStep && (
            <View className="w-full mt-8">
              <TextInput
                ref={nameInputRef}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.inputPlaceholder}
                autoFocus
                autoCapitalize="words"
                returnKeyType="next"
                className="w-full rounded-xl px-4 py-3.5 text-lg text-center"
                style={{
                  ...colors.bgInput,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Your phone number"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleNext}
                className="w-full mt-3 rounded-xl px-4 py-3.5 text-lg text-center"
                style={{
                  ...colors.bgInput,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
              <Text
                className="text-xs text-center mt-2"
                style={{ color: colors.textTertiary }}
              >
                Your phone number is used to receive push notifications only
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Bottom navigation */}
        <View className="items-center">
          {/* Dots */}
          <View className="flex-row mb-8">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <View
                key={i}
                className="w-2.5 h-2.5 rounded-full mx-1.5"
                style={{
                  backgroundColor:
                    i === step
                      ? colors.accent
                      : colors.isDark
                        ? '#334155'
                        : '#d1d5db',
                }}
              />
            ))}
          </View>

          {/* Button */}
          <Pressable
            onPress={handleNext}
            className="w-full rounded-xl py-4 items-center active:opacity-80"
            style={{
              backgroundColor: colors.accent,
              ...(colors.isDark
                ? {
                    shadowColor: colors.accent,
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                  }
                : {}),
            }}
          >
            <Text
              className="font-bold text-base"
              style={{ color: colors.accentText }}
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
