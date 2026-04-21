import { Alert } from 'react-native';
import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { goToLogin } from '@/services/auth-navigation.service';
import type { AuthRole } from '@/types/auth';

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
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'instructor' && !universityNumber.trim()) {
      setError('University number is required for instructors.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await register({
        confirmPassword,
        email,
        password,
        role,
        universityNumber: role === 'instructor' ? universityNumber : undefined,
      });

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
