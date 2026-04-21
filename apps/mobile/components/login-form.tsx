import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/constants/tokens';
import { useLoginForm } from '@/hooks/use-login-form';
import { goToRegister } from '@/services/auth-navigation.service';

import { AppButton } from './app-button';
import { AppTextField, InlineFieldLink } from './app-text-field';
import { RoleSwitch } from './role-switch';

export function LoginForm() {
  const { email, error, handleSubmit, isSubmitting, password, role, setEmail, setPassword, setRole } =
    useLoginForm();

  return (
    <View style={styles.container}>
      <RoleSwitch onChange={setRole} value={role} />

      <View style={styles.formFields}>
        <AppTextField
          autoCapitalize="none"
          autoComplete="email"
          editable={!isSubmitting}
          keyboardType="email-address"
          label="Academic Email"
          onChangeText={setEmail}
          placeholder="name@campus.edu"
          rightAdornment={
            <MaterialIcons color={tokens.colors.outline} name="alternate-email" size={20} />
          }
          value={email}
        />

        <AppTextField
          editable={!isSubmitting}
          label="Password"
          labelAccessory={<InlineFieldLink label="Forgot?" />}
          onChangeText={setPassword}
          placeholder="••••••••"
          rightAdornment={
            <MaterialIcons color={tokens.colors.outline} name="lock-outline" size={20} />
          }
          secureTextEntry
          value={password}
        />

        <AppButton
          disabled={isSubmitting}
          label={isSubmitting ? 'Signing In...' : 'Login'}
          onPress={handleSubmit}
          trailing={
            <MaterialIcons color={tokens.colors.onPrimary} name="arrow-forward" size={20} />
          }
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.divider} />
      </View>

      <AppButton
        disabled
        label="Continue with Google"
        leading={
          <MaterialCommunityIcons
            color={tokens.colors.onPrimaryFixed}
            name="google"
            size={20}
          />
        }
        onPress={() => undefined}
        variant="secondary"
      />

      <Text style={styles.helperText}>
        New to campus?{' '}
        <Text onPress={goToRegister} style={styles.helperLink}>
          Register your ID
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xl,
  },
  formFields: {
    gap: tokens.spacing.md,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.lg,
  },
  divider: {
    backgroundColor: tokens.effects.divider,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: tokens.colors.outline,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  helperText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: tokens.colors.error,
    fontSize: tokens.typography.body,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'center',
  },
  helperLink: {
    color: tokens.colors.primary,
    fontWeight: '800',
  },
});
