import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useLoginForm } from '@/hooks/use-login-form';
import { goToRegister } from '@/services/auth-navigation.service';

import { AppButton } from './app-button';
import { AppTextField, InlineFieldLink } from './app-text-field';

export function LoginForm() {
  const { colors } = useAppTheme();
  const { email, error, handleSubmit, isSubmitting, password, setEmail, setPassword } =
    useLoginForm();

  return (
    <View className="gap-xl">
      <View className="gap-md">
        <AppTextField
          autoCapitalize="none"
          autoComplete="email"
          editable={!isSubmitting}
          keyboardType="email-address"
          label="Academic Email"
          onChangeText={setEmail}
          placeholder="name@campus.edu"
          rightAdornment={
            <MaterialIcons color={colors.outline} name="alternate-email" size={20} />
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
            <MaterialIcons color={colors.outline} name="lock-outline" size={20} />
          }
          secureTextEntry
          value={password}
        />

        <AppButton
          disabled={isSubmitting}
          label={isSubmitting ? 'Signing In...' : 'Login'}
          onPress={handleSubmit}
          trailing={
            <MaterialIcons color={colors.onPrimary} name="arrow-forward" size={20} />
          }
        />
      </View>

      {error ? (
        <Text className="text-center text-body font-semibold leading-[21px] text-error">
          {error}
        </Text>
      ) : null}

      <View className="flex-row items-center gap-lg">
        <View className="h-px flex-1 bg-outlineVariant" />
        <Text className="text-micro font-extrabold uppercase tracking-[1.2px] text-outline">
          or continue with
        </Text>
        <View className="h-px flex-1 bg-outlineVariant" />
      </View>

      <AppButton
        disabled
        label="Continue with Google"
        leading={
          <MaterialCommunityIcons
            color={colors.onPrimaryFixed}
            name="google"
            size={20}
          />
        }
        onPress={() => undefined}
        variant="secondary"
      />

      <Text className="text-center text-body font-medium text-onSurfaceVariant">
        New to campus?{' '}
        <Text onPress={goToRegister} className="font-extrabold text-primary">
          Sign up
        </Text>
      </Text>
    </View>
  );
}
