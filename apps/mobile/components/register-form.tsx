import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/constants/tokens';
import { useRegisterForm } from '@/hooks/use-register-form';
import { goToLogin } from '@/services/auth-navigation.service';

import { AppButton } from './app-button';
import { AppTextField } from './app-text-field';
import { RoleSwitch } from './role-switch';

export function RegisterForm() {
  const {
    confirmPassword,
    email,
    error,
    handleSubmit,
    isSubmitting,
    password,
    role,
    setConfirmPassword,
    setEmail,
    setPassword,
    setRole,
    setUniversityNumber,
    universityNumber,
  } = useRegisterForm();

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
          placeholder={role === 'student' ? 'student@gmail.com' : 'name@campus.edu'}
          rightAdornment={
            <MaterialIcons color={tokens.colors.outline} name="alternate-email" size={20} />
          }
          value={email}
        />

        {role === 'instructor' ? (
          <AppTextField
            editable={!isSubmitting}
            keyboardType="number-pad"
            label="University Number"
            onChangeText={setUniversityNumber}
            placeholder="20241234"
            rightAdornment={
              <MaterialIcons color={tokens.colors.outline} name="badge" size={20} />
            }
            value={universityNumber}
          />
        ) : null}

        <AppTextField
          editable={!isSubmitting}
          label="Password"
          onChangeText={setPassword}
          placeholder="••••••••"
          rightAdornment={
            <MaterialIcons color={tokens.colors.outline} name="lock-outline" size={20} />
          }
          secureTextEntry
          value={password}
        />

        <AppTextField
          editable={!isSubmitting}
          label="Confirm Password"
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          rightAdornment={
            <MaterialIcons color={tokens.colors.outline} name="verified-user" size={20} />
          }
          secureTextEntry
          value={confirmPassword}
        />

        <AppButton
          disabled={isSubmitting}
          label={isSubmitting ? 'Creating Account...' : 'Create Account'}
          onPress={handleSubmit}
          trailing={
            <MaterialIcons color={tokens.colors.onPrimary} name="mail-outline" size={20} />
          }
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.helperText}>
        Already verified?{' '}
        <Text onPress={goToLogin} style={styles.helperLink}>
          Back to login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xl,
  },
  errorText: {
    color: tokens.colors.error,
    fontSize: tokens.typography.body,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'center',
  },
  formFields: {
    gap: tokens.spacing.md,
  },
  helperText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  helperLink: {
    color: tokens.colors.primary,
    fontWeight: '800',
  },
});
