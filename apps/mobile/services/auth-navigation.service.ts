import { router } from 'expo-router';

import { routes } from '@/navigation/routes';
import { AuthRole } from '@/types/auth';

export function enterCampus(role: AuthRole) {
  router.replace(role === 'instructor' ? routes.instructor : routes.student);
}

export function goToRegister() {
  router.push(routes.register as never);
}

export function goToLogin() {
  router.replace(routes.login);
}
