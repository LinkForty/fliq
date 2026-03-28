import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  SlideInRight,
  SlideInLeft,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { getSettings, saveSettings } from '@/lib/settings';
import { trackEvent } from '@/lib/sdk';
import { registerForPushNotifications, registerDevice } from '@/lib/push';
import { validatePhoneNumber } from '@/lib/phone-validation';
import { verifyOtp } from '@/lib/auth';
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
    body: "Give your phone a quick flick to unveil secret messages. It's the Fliq'd way — physical gestures for digital secrets.",
  },
  {
    emoji: '🔔',
    title: 'Push to phone',
    body: 'Send secrets directly to a phone number via push notification. No links, no chat history, no trace. Enable notifications to receive secrets too.',
  },
  {
    emoji: '🔒',
    title: 'Ephemeral by design',
    body: "Messages vanish after reading. Your secrets are encrypted end-to-end — not even Fliq'd can read them. Delete messages anytime, or let the app auto-delete.",
  },
  {
    emoji: '👋',
    title: 'Set up your profile',
    body: "Your name is how recipients see who sent the secret. Your phone number is how friends find you on Fliq'd.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const nameInputRef = useRef<TextInput>(null);

  const isLastStep = step === PROFILE_STEP;
  const isPushStep = step === PUSH_STEP;
  const current = STEPS[step];

  async function handleEnablePush() {
    try {
      const result = await registerForPushNotifications();
      if (result.token) {
        setPushToken(result.token);
        setPushEnabled(true);
      } else {
        Alert.alert('Notifications Unavailable', result.error);
      }
    } catch (error) {
      Alert.alert(
        'Push Setup Failed',
        error instanceof Error ? error.message : 'Could not enable push notifications.',
      );
    }
  }

  async function handleVerifyPhone() {
    if (phoneVerifying || phoneVerified) return;

    if (!name.trim()) {
      Alert.alert('Enter your name', 'We need a name to get started!');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setPhoneError('Please enter a valid phone number.');
      return;
    }

    setPhoneVerifying(true);
    setPhoneError(null);

    const result = await validatePhoneNumber(phone.trim());

    if (!result.valid) {
      setPhoneError(result.error || 'Invalid phone number.');
      setPhoneVerifying(false);
      return;
    }

    setPhone(result.formatted);

    if (result.needsOtp) {
      // OTP sent — show code entry
      setOtpSent(true);
      setPhoneVerifying(false);
    } else {
      // Already verified (cached) — token saved automatically
      setPhoneVerified(true);
      setPhoneVerifying(false);
    }
  }

  async function handleVerifyOtp() {
    if (otpVerifying || !otpCode.trim()) return;

    setOtpVerifying(true);
    setPhoneError(null);

    const result = await verifyOtp(phone.trim(), otpCode.trim());

    if (result.error) {
      setPhoneError(result.error);
      setOtpVerifying(false);
      return;
    }

    setPhoneVerified(true);
    setOtpVerifying(false);
  }

  async function handleNext() {
    if (isLastStep) {
      if (!phoneVerified) {
        await handleVerifyPhone();
        return;
      }

      const settings = await getSettings();
      await saveSettings({
        ...settings,
        userName: name.trim(),
        phoneNumber: phone,
        onboardingComplete: true,
      });

      if (pushToken) {
        const registered = await registerDevice(phone);
        if (registered) {
          const s = await getSettings();
          await saveSettings({ ...s, pushRegistered: true });
        }
      }

      trackEvent('onboarding_completed', { userName: name.trim(), hasPush: pushEnabled });
      router.replace('/');
    } else {
      setDirection('forward');
      setStep((s) => s + 1);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
    >
      <View className="flex-1 justify-between px-8 pt-24" style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}>
        {/* Content */}
        <Animated.View
          key={step}
          entering={direction === 'forward' ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
          exiting={direction === 'forward' ? SlideOutLeft.duration(300) : SlideOutRight.duration(300)}
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
                editable={!phoneVerified && !otpSent}
                className="w-full rounded-xl px-4 py-3.5 text-lg text-center"
                style={{
                  ...colors.bgInput,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                  opacity: phoneVerified || otpSent ? 0.6 : 1,
                }}
              />
              <TextInput
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setPhoneVerified(false);
                  setPhoneError(null);
                }}
                placeholder="Your phone number (e.g. +1 555 123 4567)"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="phone-pad"
                returnKeyType="done"
                editable={!phoneVerified && !otpSent}
                onSubmitEditing={handleVerifyPhone}
                className="w-full mt-3 rounded-xl px-4 py-3.5 text-lg text-center"
                style={{
                  ...colors.bgInput,
                  borderWidth: 1,
                  borderColor: phoneError
                    ? '#ef4444'
                    : phoneVerified
                      ? colors.accent
                      : colors.inputBorder,
                  color: colors.textPrimary,
                  opacity: phoneVerified || otpSent ? 0.6 : 1,
                }}
              />

              {/* OTP code input — shown after OTP is sent */}
              {otpSent && !phoneVerified && (
                <>
                  <TextInput
                    value={otpCode}
                    onChangeText={(text) => {
                      setOtpCode(text);
                      setPhoneError(null);
                    }}
                    placeholder="Enter verification code"
                    placeholderTextColor={colors.inputPlaceholder}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    autoFocus
                    maxLength={10}
                    onSubmitEditing={handleVerifyOtp}
                    className="w-full mt-3 rounded-xl px-4 py-3.5 text-lg text-center tracking-widest"
                    style={{
                      ...colors.bgInput,
                      borderWidth: 1,
                      borderColor: phoneError ? '#ef4444' : colors.inputBorder,
                      color: colors.textPrimary,
                    }}
                  />
                  <Pressable
                    onPress={handleVerifyOtp}
                    disabled={otpVerifying || !otpCode.trim()}
                    className="w-full mt-3 rounded-xl py-3 items-center active:opacity-80"
                    style={{
                      borderWidth: 1,
                      borderColor: colors.accent,
                      opacity: otpVerifying || !otpCode.trim() ? 0.6 : 1,
                    }}
                  >
                    <Text className="font-semibold text-sm" style={{ color: colors.accent }}>
                      {otpVerifying ? 'Verifying...' : 'Confirm Code'}
                    </Text>
                  </Pressable>
                  <Text
                    className="text-xs text-center mt-2"
                    style={{ color: colors.textTertiary }}
                  >
                    A verification code was sent to {phone}
                  </Text>
                </>
              )}

              {/* Verify button — shown before OTP is sent */}
              {!phoneVerified && !otpSent && (
                <Pressable
                  onPress={handleVerifyPhone}
                  disabled={phoneVerifying}
                  className="w-full mt-3 rounded-xl py-3 items-center active:opacity-80"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.accent,
                    opacity: phoneVerifying ? 0.6 : 1,
                  }}
                >
                  <Text className="font-semibold text-sm" style={{ color: colors.accent }}>
                    {phoneVerifying ? 'Sending code...' : 'Verify Phone Number'}
                  </Text>
                </Pressable>
              )}

              {/* Status message */}
              {phoneError && (
                <Text className="text-sm text-center mt-2" style={{ color: '#ef4444' }}>
                  {phoneError}
                </Text>
              )}
              {phoneVerified && (
                <View className="flex-row items-center justify-center mt-2">
                  <View
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: colors.accent }}
                  />
                  <Text className="text-sm font-semibold" style={{ color: colors.accent }}>
                    Phone number verified
                  </Text>
                </View>
              )}

              <Text
                className="text-xs text-center mt-2"
                style={{ color: colors.textTertiary }}
              >
                Friends enter your phone number to send you secrets via push
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

          {/* Navigation buttons */}
          <View className="w-full flex-row gap-3">
            {step > 0 && (
              <Pressable
                onPress={() => { setDirection('back'); setStep((s) => s - 1); }}
                className="flex-1 rounded-xl py-4 items-center active:opacity-80"
                style={{
                  borderWidth: 1,
                  borderColor: colors.isDark ? colors.accentBorder : colors.cardBorder,
                }}
              >
                <Text
                  className="font-bold text-base"
                  style={{ color: colors.textSecondary }}
                >
                  Back
                </Text>
              </Pressable>
            )}
            {(!isLastStep || phoneVerified) && (
              <Pressable
                onPress={handleNext}
                className="flex-1 rounded-xl py-4 items-center active:opacity-80"
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
            )}
          </View>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
