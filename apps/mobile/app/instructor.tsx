import { Redirect } from 'expo-router';

import { routes } from '@/navigation/routes';

export default function InstructorRedirect() {
  return <Redirect href={routes.instructor} />;
}
