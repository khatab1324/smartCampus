import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { AuthBranding } from '@/components/auth-branding';
import { RegisterForm } from '@/components/register-form';
import { ScreenShell } from '@/components/screen-shell';

export default function RegisterScreen() {
  return (
    <ScreenShell>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        className="flex-1">
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="min-h-full justify-center px-xl pb-[72px] pt-9">
            <AuthBranding />
            <View className="mb-xl mt-xl gap-sm">
              <Text className="text-headline font-black leading-9 text-onSurface">
                Create your Smart Campus account
              </Text>
            </View>
            <RegisterForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}
