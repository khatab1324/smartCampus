import { Alert } from 'react-native';
import { useState } from 'react';
import { registerInstructorSchema, registerStudentSchema } from '@smart-campus/validation';

import { useAuth } from '@/hooks/use-auth';
import { goToLogin } from '@/services/auth-navigation.service';
import type { AuthRole } from '@/types/auth';
import { getFirstValidationMessage } from '@/utils/form-validation';

export function useRegisterForm() {
  const { register } = useAuth();
  const [role, setRole] = useState<AuthRole>('student');
  const [email, setEmail] = useState('');
  const [universityNumber, setUniversityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError('');

    try {
      if (role === 'student') {
        const parsedInput = registerStudentSchema.safeParse({
          confirmPassword,
          email,
          password,
        });

        if (!parsedInput.success) {
          setError(getFirstValidationMessage(parsedInput.error));
          return;
        }

        setIsSubmitting(true);

        await register({
          confirmPassword: parsedInput.data.confirmPassword,
          email: parsedInput.data.email,
          password: parsedInput.data.password,
          role,
        });
      } else {
        const parsedInput = registerInstructorSchema.safeParse({
          confirmPassword,
          email,
          password,
          universityNumber,
        });

        if (!parsedInput.success) {
          setError(getFirstValidationMessage(parsedInput.error));
          return;
        }

        setIsSubmitting(true);

        await register({
          confirmPassword: parsedInput.data.confirmPassword,
          email: parsedInput.data.email,
          password: parsedInput.data.password,
          role,
          universityNumber: parsedInput.data.universityNumber,
        });
      }

      Alert.alert(
        'Verify your email',
        'We sent a verification link to your email. Verify the account, then sign in.'
      );
      goToLogin();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to register right now.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
