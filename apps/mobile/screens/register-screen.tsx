import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthBranding } from '@/components/auth-branding';
import { RegisterForm } from '@/components/register-form';
import { ScreenShell } from '@/components/screen-shell';
import { tokens } from '@/constants/tokens';

export default function RegisterScreen() {
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
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>Firebase Auth</Text>
            <Text style={styles.title}>Create your Smart Campus account</Text>
            <Text style={styles.description}>
              Register once, verify your email, then use the same account across the app and backend.
            </Text>
          </View>
          <RegisterForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 72,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: 36,
  },
  description: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    lineHeight: 22,
  },
  eyebrow: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  flex: {
    flex: 1,
  },
  headerBlock: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xl,
    marginTop: tokens.spacing.xl,
  },
  title: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.headline,
    fontWeight: '900',
    lineHeight: 36,
  },
});
