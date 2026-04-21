import type { AuthUser, UpsertUserProfileInput } from '@smart-campus/types';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import {
  getCurrentUserProfile,
  registerWithEmail,
  signInWithEmail,
} from '@/services/firebase-auth.service';
import { auth } from '@/services/firebase';

type RegisterInput = UpsertUserProfileInput & {
  confirmPassword: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  authUser: FirebaseUser | null;
  isHydrating: boolean;
  profile: AuthUser | null;
  refreshProfile: () => Promise<AuthUser | null>;
  register: (input: RegisterInput) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<AuthUser>;
  signOutCurrentUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  async function refreshProfile() {
    const nextProfile = await getCurrentUserProfile();
    setProfile(nextProfile);
    return nextProfile;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setAuthUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setIsHydrating(false);
        return;
      }

      try {
        const nextProfile = await getCurrentUserProfile();
        setProfile(nextProfile);
      } catch {
        setProfile(null);
      } finally {
        setIsHydrating(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    authUser,
    isHydrating,
    profile,
    refreshProfile,
    register: async (input) => {
      await registerWithEmail(input);
      setProfile(null);
    },
    signIn: async (input) => {
      const nextProfile = await signInWithEmail(input);
      setProfile(nextProfile);
      return nextProfile;
    },
    signOutCurrentUser: async () => {
      await signOut(auth);
      setProfile(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
