import { router } from 'expo-router';

import { routes } from '@/navigation/routes';

type OpenLiveAttendanceInput = {
  days: string[];
  lectureName: string;
  startTime: string;
};

export function openCreateLectureScreen() {
  router.push(routes.createLecture);
}

export function openInstructorDashboard() {
  router.replace(routes.instructor);
}

export function openLiveAttendanceScreen(input: OpenLiveAttendanceInput) {
  router.replace({
    params: {
      days: input.days.join(','),
      lectureName: input.lectureName,
      startTime: input.startTime,
    },
    pathname: routes.liveAttendance,
  });
}
