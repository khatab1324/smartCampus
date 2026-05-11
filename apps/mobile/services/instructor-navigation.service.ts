import { router } from 'expo-router';

import { routes } from '@/navigation/routes';

type OpenLiveAttendanceInput = {
  days?: string[];
  lectureId?: string;
  lectureName?: string;
  mode?: 'push' | 'replace';
  startTime?: string;
};

export function openCreateLectureScreen() {
  router.push(routes.createLecture);
}

export function openInstructorDashboard() {
  router.replace(routes.instructor);
}

export function openLiveAttendanceScreen(input: OpenLiveAttendanceInput) {
  const route = {
    params: {
      days: input.days?.join(','),
      lectureId: input.lectureId,
      lectureName: input.lectureName,
      startTime: input.startTime,
    },
    pathname: routes.liveAttendance,
  } as const;

  if (input.mode === 'replace') {
    router.replace(route);
    return;
  }

  router.push(route);
}
