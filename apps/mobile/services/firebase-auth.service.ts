import type { AuthUser, UpsertUserProfileInput } from '@smart-campus/types';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from './firebase';
import { fetchCurrentUserProfile, upsertCurrentUserProfile } from './user-profile.service';

type RegisterWithEmailInput = UpsertUserProfileInput & {
  email: string;
  password: string;
};

export async function registerWithEmail(input: RegisterWithEmailInput) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email.trim(),
    input.password
  );

  await sendEmailVerification(credential.user);

  const idToken = await credential.user.getIdToken();

  await upsertCurrentUserProfile(
    {
      role: input.role,
      universityNumber: input.universityNumber,
    },
    idToken
  );

  await signOut(auth);
}

export async function signInWithEmail(input: { email: string; password: string }) {
  const credential = await signInWithEmailAndPassword(auth, input.email.trim(), input.password);

  await credential.user.reload();

  if (!credential.user.emailVerified) {
    await signOut(auth);
    throw new Error('Verify your email before signing in.');
  }

  const idToken = await credential.user.getIdToken(true);

  return fetchCurrentUserProfile(idToken);
}

export async function syncCurrentUserProfile(input: UpsertUserProfileInput): Promise<AuthUser> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('No authenticated Firebase user');
  }

  const idToken = await currentUser.getIdToken(true);

  return upsertCurrentUserProfile(input, idToken);
}

export async function getCurrentUserProfile(): Promise<AuthUser | null> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  await currentUser.reload();

  if (!currentUser.emailVerified) {
    return null;
  }

  const idToken = await currentUser.getIdToken(true);

  return fetchCurrentUserProfile(idToken);
}
