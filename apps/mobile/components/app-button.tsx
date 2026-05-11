import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type AppButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function AppButton({
  disabled = false,
  label,
  onPress,
  variant = 'primary',
  leading,
  trailing,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const buttonClassName = [
    'relative min-h-[56px] flex-row items-center justify-center gap-sm overflow-hidden rounded-xl px-xl',
    isPrimary ? 'bg-primary' : 'bg-primaryFixed',
    disabled && 'opacity-55',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={buttonClassName}>
      {isPrimary ? (
        <View className="absolute -right-[38px] -top-[58px] h-[160px] w-[160px] rounded-pill bg-primaryContainer opacity-55" />
      ) : null}
      {leading}
      <Text
        className={[
          'text-bodyLg font-extrabold',
          isPrimary ? 'text-onPrimary' : 'text-onPrimaryFixed',
        ].join(' ')}>
        {label}
      </Text>
      {trailing}
    </Pressable>
  );
}
