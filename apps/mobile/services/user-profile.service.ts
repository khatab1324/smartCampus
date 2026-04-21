import type { AuthUser, UpsertUserProfileInput } from '@smart-campus/types';

import { apiRequest } from './api-client';

export function fetchCurrentUserProfile(idToken: string) {
  return apiRequest<AuthUser>('/auth/me', { method: 'GET' }, idToken);
}

export function upsertCurrentUserProfile(input: UpsertUserProfileInput, idToken: string) {
  return apiRequest<AuthUser>(
    '/auth/profile',
    {
      body: JSON.stringify(input),
      method: 'PUT',
    },
    idToken
  );
}
