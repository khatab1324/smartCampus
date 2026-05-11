import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { AuthBranding } from '@/components/auth-branding';
import { LoginForm } from '@/components/login-form';
import { ScreenShell } from '@/components/screen-shell';
import { useAuth } from '@/hooks/use-auth';
import { enterCampus } from '@/services/auth-navigation.service';

export default function LoginScreen() {
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      enterCampus(profile.role);
    }
  }, [profile]);

  return (
    <ScreenShell>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        className="flex-1">
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="min-h-full justify-center px-xl py-9">
            <View className="w-full max-w-[420px] self-center">
              <AuthBranding />
              <LoginForm />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}
