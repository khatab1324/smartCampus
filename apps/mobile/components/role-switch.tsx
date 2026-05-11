import { Pressable, Text, View } from 'react-native';

import { AuthRole } from '@/types/auth';

type RoleSwitchProps = {
  onChange: (role: AuthRole) => void;
  value: AuthRole;
};

export function RoleSwitch({ onChange, value }: RoleSwitchProps) {
  return (
    <View className="flex-row gap-[6px] rounded-xl bg-surfaceHigh p-[6px]">
      <RoleOption active={value === 'student'} label="Student" onPress={() => onChange('student')} />
      <RoleOption
        active={value === 'instructor'}
        label="Instructor"
        onPress={() => onChange('instructor')}
      />
    </View>
  );
}

function RoleOption({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'min-h-[44px] flex-1 items-center justify-center rounded-md',
        active && 'bg-surfaceLowest',
      ]
        .filter(Boolean)
        .join(' ')}>
      <Text
        className={[
          'text-body font-semibold text-onSurfaceVariant',
          active && 'text-primary',
        ]
          .filter(Boolean)
          .join(' ')}>
        {label}
      </Text>
    </Pressable>
  );
}
