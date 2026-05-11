import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AvailableSessionsHeader } from '@/components/available-sessions/available-sessions-header';
import { AvailableSessionsSummary } from '@/components/available-sessions/available-sessions-summary';
import { LiveSessionsList } from '@/components/available-sessions/live-sessions-list';
import { NearbyScanCard } from '@/components/available-sessions/nearby-scan-card';
import { SessionKeyLauncher } from '@/components/available-sessions/session-key-launcher';
import { SessionKeySearchModal } from '@/components/available-sessions/session-key-search-modal';
import { StudentSideMenuModal } from '@/components/available-sessions/student-side-menu-modal';
import { ScreenShell } from '@/components/screen-shell';
import { useAuth } from '@/hooks/use-auth';
import { routes } from '@/navigation/routes';
import { getCurrentDeviceLocation, DeviceLocation } from '@/services/device-location.service';
import {
  doesLectureKeyMatch,
  getLectureDiscoveryMode,
  InstructorLecture,
  isLectureDiscoverable,
  listLiveLectures,
  normalizeDiscoveryKey,
  subscribeLiveLectures,
} from '@/services/lecture-session.service';
import { openLectureSessionInformationScreen } from '@/services/session-navigation.service';
import { getInitialsFromEmail } from '@/utils/user';

export default function AvailableSessionsScreen() {
  const { authUser, profile } = useAuth();
  const [liveLectures, setLiveLectures] = useState<InstructorLecture[]>([]);
  const [searchKey, setSearchKey] = useState('');
  const [searchedSessionKey, setSearchedSessionKey] = useState('');
  const [sessionKeyResults, setSessionKeyResults] = useState<InstructorLecture[]>([]);
  const [hasSearchedSessionKey, setHasSearchedSessionKey] = useState(false);
  const [studentLocation, setStudentLocation] = useState<DeviceLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [sessionKeyModalVisible, setSessionKeyModalVisible] = useState(false);
  const email = profile?.email ?? authUser?.email ?? 'student@smartcampus.edu';
  const initials = getInitialsFromEmail(email) || 'ST';
  const normalizedDraftSearchKey = normalizeDiscoveryKey(searchKey);
  const visibleLectures = useMemo(
    () =>
      liveLectures.filter((lecture) =>
        isLectureDiscoverable(lecture, {
          location: studentLocation,
          searchKey: '',
        })
      ),
    [liveLectures, studentLocation]
  );
  const nearbyMatchCount = liveLectures.filter(
    (lecture) =>
      getLectureDiscoveryMode(lecture) !== 'search-key' &&
      isLectureDiscoverable(lecture, {
        location: studentLocation,
        searchKey: '',
      })
  ).length;
  const locationStatus = studentLocation
    ? `${nearbyMatchCount} nearby ${nearbyMatchCount === 1 ? 'session' : 'sessions'} in range`
    : 'Location unavailable. Search key still works.';

  const refreshSessions = useCallback(async () => {
    setIsLocating(true);
    const lectures = await listLiveLectures();

    setLiveLectures(lectures);
    const location = await getCurrentDeviceLocation().catch(() => null);

    setStudentLocation(location);
    setIsLocating(false);
  }, []);

  const findSessionByKey = useCallback(async () => {
    if (normalizedDraftSearchKey.length < 2) {
      return;
    }

    const lectures = await listLiveLectures();
    setLiveLectures(lectures);
    setSessionKeyResults(
      lectures.filter((lecture) => doesLectureKeyMatch(lecture, normalizedDraftSearchKey))
    );
    setSearchedSessionKey(normalizedDraftSearchKey);
    setHasSearchedSessionKey(true);
    setSearchKey(normalizedDraftSearchKey);
  }, [normalizedDraftSearchKey]);

  function openSideMenuRoute(route: (typeof routes)[keyof typeof routes]) {
    setSideMenuVisible(false);
    router.replace(route);
  }

  function handleSearchKeyChange(value: string) {
    setSearchKey(normalizeDiscoveryKey(value).slice(0, 12));
    setHasSearchedSessionKey(false);
    setSearchedSessionKey('');
    setSessionKeyResults([]);
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const unsubscribe = subscribeLiveLectures((lectures) => {
        if (isActive) {
          setLiveLectures(lectures);
        }
      });

      async function loadSessions() {
        setIsLocating(true);
        const location = await getCurrentDeviceLocation().catch(() => null);

        if (isActive) {
          setStudentLocation(location);
          setIsLocating(false);
        }
      }

      loadSessions();

      return () => {
        isActive = false;
        unsubscribe();
      };
    }, [])
  );

  return (
    <ScreenShell>
      <View className="flex-1">
        <AvailableSessionsHeader
          initials={initials}
          onOpenMenu={() => setSideMenuVisible(true)}
        />

        <ScrollView
          contentContainerClassName="px-xl pb-[56px] pt-xl"
          showsVerticalScrollIndicator={false}>
          <AvailableSessionsSummary
            isLocating={isLocating}
            visibleCount={visibleLectures.length}
          />
          <NearbyScanCard
            isLocating={isLocating}
            locationStatus={locationStatus}
            onRefresh={refreshSessions}
          />
          <SessionKeyLauncher onPress={() => setSessionKeyModalVisible(true)} />
          <LiveSessionsList
            lectures={visibleLectures}
            onOpenLecture={openLectureSessionInformationScreen}
            studentLocation={studentLocation}
          />
        </ScrollView>

        <StudentSideMenuModal
          onClose={() => setSideMenuVisible(false)}
          onRoutePress={openSideMenuRoute}
          visible={sideMenuVisible}
        />

        <SessionKeySearchModal
          hasSearchedSessionKey={hasSearchedSessionKey}
          normalizedSearchKey={normalizedDraftSearchKey}
          onChangeSearchKey={handleSearchKeyChange}
          onClose={() => setSessionKeyModalVisible(false)}
          onOpenLecture={openLectureSessionInformationScreen}
          onSearch={findSessionByKey}
          searchKey={searchKey}
          searchedSessionKey={searchedSessionKey}
          sessionKeyResults={sessionKeyResults}
          visible={sessionKeyModalVisible}
        />
      </View>
    </ScreenShell>
  );
}
