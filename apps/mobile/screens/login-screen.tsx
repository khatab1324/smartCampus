import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthBranding } from '@/components/auth-branding';
import { LoginForm } from '@/components/login-form';
import { ScreenShell } from '@/components/screen-shell';
import { tokens } from '@/constants/tokens';
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
        style={styles.flex}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <AuthBranding />
          <LoginForm />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerBadge}>Secured by Smart Campus Infrastructure</Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 140,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: 36,
  },
  footer: {
    alignItems: 'center',
    bottom: 24,
    left: tokens.spacing.xl,
    position: 'absolute',
    right: tokens.spacing.xl,
  },
  footerBadge: {
    backgroundColor: tokens.chrome.footerPill,
    borderRadius: tokens.radii.pill,
    color: tokens.colors.outline,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1.2,
    overflow: 'hidden',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    textTransform: 'uppercase',
  },
});
