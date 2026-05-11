import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { enterCampus } from '@/services/auth-navigation.service';

export function useLoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setError('');

      const user = await signIn({
        email,
        password,
      });

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
