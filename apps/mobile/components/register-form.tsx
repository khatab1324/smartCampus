import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useRegisterForm } from '@/hooks/use-register-form';
import { goToLogin } from '@/services/auth-navigation.service';

import { AppButton } from './app-button';
import { AppTextField } from './app-text-field';
import { RoleSwitch } from './role-switch';

export function RegisterForm() {
  const { colors } = useAppTheme();
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
    <View className="gap-xl">
      <RoleSwitch onChange={setRole} value={role} />

      <View className="gap-md">
        <AppTextField
          autoCapitalize="none"
          autoComplete="email"
          editable={!isSubmitting}
          keyboardType="email-address"
          label="Academic Email"
          onChangeText={setEmail}
          placeholder={role === 'student' ? 'student@gmail.com' : 'name@campus.edu'}
          rightAdornment={
            <MaterialIcons color={colors.outline} name="alternate-email" size={20} />
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
              <MaterialIcons color={colors.outline} name="badge" size={20} />
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
            <MaterialIcons color={colors.outline} name="lock-outline" size={20} />
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
            <MaterialIcons color={colors.outline} name="verified-user" size={20} />
          }
          secureTextEntry
          value={confirmPassword}
        />

        <AppButton
          disabled={isSubmitting}
          label={isSubmitting ? 'Creating Account...' : 'Create Account'}
          onPress={handleSubmit}
          trailing={
            <MaterialIcons color={colors.onPrimary} name="mail-outline" size={20} />
          }
        />
      </View>

      {error ? (
        <Text className="text-center text-body font-semibold leading-[21px] text-error">
          {error}
        </Text>
      ) : null}

      <Text className="text-center text-body font-medium text-onSurfaceVariant">
        Already verified?{' '}
        <Text onPress={goToLogin} className="font-extrabold text-primary">
          Back to login
        </Text>
      </Text>
    </View>
  );
}
