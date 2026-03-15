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

const TOTAL_STEPS = 5;

const STEPS = [
  {
    emoji: '\u{1F92B}',
    title: 'Welcome to Fliq',
    body: 'Send secret messages that only the recipient can reveal.',
  },
  {
    emoji: '\u{1FAF0}',
    title: 'Flick to Reveal',
    body: 'Give your phone a quick flick to reveal messages \u2014 that\'s the Fliq way!\n\nYou can also scratch or tap to reveal. Choose a style each time you send.',
  },
  {
    emoji: '\u{1F514}',
    title: 'Push Delivery',
    body: 'Send secrets directly to a phone number via push notification. No links, no chat history, no trace.\n\nMessages are deleted from the server the moment they\'re opened.',
  },
  {
    emoji: '\u{1F512}',
    title: 'Your Privacy, Your Data',
    body: 'Messages are stored only on your phone \u2014 never in a database.\n\nDelete them anytime. By default, messages vanish after you read them.',
  },
  {
    emoji: '\u{1F44B}',
    title: 'Set Up Your Profile',
    body: 'Enter your name and phone number to receive push secrets from friends.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const nameInputRef = useRef<TextInput>(null);

  const isLastStep = step === TOTAL_STEPS - 1;
  const current = STEPS[step];

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

      // Request push notification permissions and register device
      const pushToken = await registerForPushNotifications();
      if (pushToken) {
        const registered = await registerDevice(phone.trim());
        if (registered) {
          const s = await getSettings();
          await saveSettings({ ...s, pushRegistered: true });
        }
      }

      trackEvent('onboarding_completed', { userName: name.trim(), hasPush: !!pushToken });
      router.replace('/');
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-gray-900"
    >
      <View className="flex-1 justify-between px-8 pt-24 pb-12">
        {/* Content */}
        <Animated.View
          key={step}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(200)}
          className="flex-1 justify-center items-center"
        >
          <View className="w-24 h-24 items-center justify-center mb-6" style={{ overflow: 'visible' }}>
            <Text style={{ fontSize: 72, lineHeight: 90 }}>{current.emoji}</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            {current.title}
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 text-center leading-relaxed px-4">
            {current.body}
          </Text>

          {/* Profile inputs on last step */}
          {isLastStep && (
            <View className="w-full mt-8">
              <TextInput
                ref={nameInputRef}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#9ca3af"
                autoFocus
                autoCapitalize="words"
                returnKeyType="next"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white text-lg text-center"
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleNext}
                className="w-full mt-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white text-lg text-center"
              />
              <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                Your phone number is only used to receive push secrets
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
                className={`w-2.5 h-2.5 rounded-full mx-1.5 ${
                  i === step
                    ? 'bg-indigo-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </View>

          {/* Button */}
          <Pressable
            onPress={handleNext}
            className="w-full rounded-xl py-4 items-center bg-indigo-500 active:bg-indigo-600"
          >
            <Text className="text-white font-semibold text-base">
              {isLastStep ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>

          {/* Skip on non-last steps */}
          {!isLastStep && (
            <Pressable
              onPress={() => setStep(TOTAL_STEPS - 1)}
              className="mt-4 py-2"
            >
              <Text className="text-gray-400 dark:text-gray-500 text-sm">
                Skip
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
