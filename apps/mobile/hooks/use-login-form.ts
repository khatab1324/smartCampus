import { useState } from 'react';
import { loginSchema } from '@smart-campus/validation';

import { useAuth } from '@/hooks/use-auth';
import { enterCampus } from '@/services/auth-navigation.service';
import { getFirstValidationMessage } from '@/utils/form-validation';

export function useLoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError('');

    const parsedInput = loginSchema.safeParse({
      email,
      password,
    });

    if (!parsedInput.success) {
      setError(getFirstValidationMessage(parsedInput.error));
      return;
    }

    try {
      setIsSubmitting(true);

      const user = await signIn(parsedInput.data);

      enterCampus(user.role);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to sign in right now.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    error,
    handleSubmit,
    isSubmitting,
    password,
    setEmail,
    setPassword,
  };
}
