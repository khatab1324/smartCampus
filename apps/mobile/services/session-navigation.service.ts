import { router } from 'expo-router';

import { routes } from '@/navigation/routes';

export function openAvailableSessionsScreen() {
  router.push(routes.availableSessions);
}

export function openHistoryScreen() {
  router.push(routes.history);
}

export function openSessionInformationScreen(sessionCode: string) {
  router.push({
    params: { sessionCode },
    pathname: routes.sessionInformation,
  });
}

export function openLectureSessionInformationScreen(lectureId: string) {
  router.push({
    params: { lectureId },
    pathname: routes.sessionInformation,
  });
}
