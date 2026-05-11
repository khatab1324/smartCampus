import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  runTransaction,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from './firebase';

export type LectureDurationMinutes = 60 | 90;
export type LectureDiscoveryMode = 'nearby' | 'search-key' | 'both';
export type LectureLaunchMode = 'now' | 'scheduled';
export type LectureSessionStatus = 'scheduled' | 'live' | 'ended';

export type LectureLocation = {
  accuracy?: number | null;
  capturedAt: string;
  latitude: number;
  longitude: number;
};

export type LectureAttendanceEvent = {
  checkedInAt: string;
  checkInCount?: number;
  email?: string | null;
  firstCheckedInAt?: string;
  id: string;
  name: string;
  status: string;
};

export type InstructorLecture = {
  attendanceCount: number;
  attendanceEvents: LectureAttendanceEvent[];
  code: string;
  createdAt: string;
  days: string[];
  discoveryKey?: string;
  discoveryMode?: LectureDiscoveryMode;
  durationMinutes: LectureDurationMinutes;
  endTime: string;
  endedAt?: string;
  id: string;
  instructorEmail?: string | null;
  instructorId: string;
  launchMode?: LectureLaunchMode;
  location?: LectureLocation;
  scheduledEndAt?: string;
  scheduledStartAt?: string;
  sessionPin: string;
  startTime: string;
  status: LectureSessionStatus;
  title: string;
  visibilityRadiusMeters?: number;
};

type CreateInstructorLectureInput = {
  days: string[];
  discoveryKey?: string;
  discoveryMode: LectureDiscoveryMode;
  durationMinutes: LectureDurationMinutes;
  instructorEmail?: string | null;
  instructorId: string;
  launchMode: LectureLaunchMode;
  location?: LectureLocation | null;
  sessionPin: string;
  startTime?: string;
  title: string;
};

type EndLiveAttendanceInput = {
  attendanceCount: number;
  attendanceEvents: LectureAttendanceEvent[];
};

type JoinLiveLectureInput = {
  pin: string;
  studentEmail?: string | null;
  studentId: string;
  studentName: string;
};

type LectureSnapshotHandler = (lecture: InstructorLecture | null) => void;
type LecturesSnapshotHandler = (lectures: InstructorLecture[]) => void;
type SnapshotErrorHandler = (error: Error) => void;

const LECTURES_COLLECTION = 'lectures';
const ATTENDANCE_COLLECTION = 'attendance';
export const DEFAULT_DISCOVERY_RADIUS_METERS = 150;
const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDurationLabel(durationMinutes: LectureDurationMinutes) {
  return durationMinutes === 90 ? '1.5 hours' : '1 hour';
}

export function getLectureEndTime(startTime: string, durationMinutes: LectureDurationMinutes) {
  const parsedTime = parseClockTime(startTime);

  if (!parsedTime) {
    return null;
  }

  const totalMinutes = parsedTime.hours * 60 + parsedTime.minutes + durationMinutes;
  return formatClockTime(totalMinutes);
}

export function getCurrentClockTime(date = new Date()) {
  return formatClockTime(date.getHours() * 60 + date.getMinutes());
}

export async function createInstructorLecture(input: CreateInstructorLectureInput) {
  const nowDate = new Date();
  const now = nowDate.toISOString();
  const code = buildLectureCode(input.title);
  const scheduleWindow =
    input.launchMode === 'now'
      ? getImmediateScheduleWindow(input.durationMinutes, nowDate)
      : getScheduledWindow(input.days, input.startTime ?? '', input.durationMinutes, nowDate);

  if (!scheduleWindow) {
    throw new Error('Enter a valid scheduled start time.');
  }

  const lectureData = compactObject({
    attendanceCount: 0,
    code,
    createdAt: now,
    days: input.days,
    discoveryKey:
      input.discoveryMode !== 'nearby'
        ? normalizeDiscoveryKey(input.discoveryKey || code)
        : undefined,
    discoveryMode: input.discoveryMode,
    durationMinutes: input.durationMinutes,
    endTime: scheduleWindow.endTime,
    endedAt: undefined,
    instructorEmail: input.instructorEmail ?? null,
    instructorId: input.instructorId,
    launchMode: input.launchMode,
    location: input.discoveryMode !== 'search-key' ? (input.location ?? null) : null,
    scheduledEndAt: scheduleWindow.endDate.toISOString(),
    scheduledStartAt: scheduleWindow.startDate.toISOString(),
    sessionPin: input.sessionPin,
    startTime: scheduleWindow.startTime,
    status: getStatusForWindow(scheduleWindow.startDate, scheduleWindow.endDate, nowDate),
    title: input.title,
    visibilityRadiusMeters:
      input.discoveryMode !== 'search-key' ? DEFAULT_DISCOVERY_RADIUS_METERS : undefined,
  });

  const lectureRef = await addDoc(collection(db, LECTURES_COLLECTION), lectureData);

  return mapLectureData(lectureRef.id, lectureData, []);
}

export async function listInstructorLectures(instructorId: string) {
  const snapshot = await getDocs(
    query(collection(db, LECTURES_COLLECTION), where('instructorId', '==', instructorId))
  );
  const lectures = await Promise.all(snapshot.docs.map((lectureDoc) => mapLectureWithAttendance(lectureDoc)));

  return sortLectures(lectures.filter((lecture): lecture is InstructorLecture => Boolean(lecture)));
}

export function subscribeInstructorLectures(
  instructorId: string,
  onNext: LecturesSnapshotHandler,
  onError?: SnapshotErrorHandler
) {
  let latestDocs: QueryDocumentSnapshot<DocumentData>[] = [];
  let version = 0;

  const emit = async () => {
    const currentVersion = version + 1;
    version = currentVersion;

    try {
      const lectures = await Promise.all(latestDocs.map((lectureDoc) => mapLectureWithAttendance(lectureDoc)));

      if (currentVersion === version) {
        onNext(sortLectures(lectures.filter((lecture): lecture is InstructorLecture => Boolean(lecture))));
      }
    } catch (error) {
      onError?.(toError(error));
    }
  };

  const unsubscribe = onSnapshot(
    query(collection(db, LECTURES_COLLECTION), where('instructorId', '==', instructorId)),
    (snapshot) => {
      latestDocs = snapshot.docs;
      void emit();
    },
    (error) => onError?.(toError(error))
  );
  const statusTimer = setInterval(() => {
    void emit();
  }, 30000);

  return () => {
    clearInterval(statusTimer);
    unsubscribe();
  };
}

export async function listLiveLectures() {
  const snapshot = await getDocs(collection(db, LECTURES_COLLECTION));

  return sortLectures(
    snapshot.docs
      .map((lectureDoc) => mapLectureDoc(lectureDoc))
      .filter((lecture): lecture is InstructorLecture => Boolean(lecture && lecture.status === 'live'))
  );
}

export function subscribeLiveLectures(
  onNext: LecturesSnapshotHandler,
  onError?: SnapshotErrorHandler
) {
  let latestDocs: QueryDocumentSnapshot<DocumentData>[] = [];

  const emit = () => {
    onNext(
      sortLectures(
        latestDocs
          .map((lectureDoc) => mapLectureDoc(lectureDoc))
          .filter((lecture): lecture is InstructorLecture => Boolean(lecture && lecture.status === 'live'))
      )
    );
  };

  const unsubscribe = onSnapshot(
    collection(db, LECTURES_COLLECTION),
    (snapshot) => {
      latestDocs = snapshot.docs;
      emit();
    },
    (error) => onError?.(toError(error))
  );
  const statusTimer = setInterval(emit, 30000);

  return () => {
    clearInterval(statusTimer);
    unsubscribe();
  };
}

export async function listDiscoverableLiveLectures(input: {
  location?: LectureLocation | null;
  searchKey?: string;
}) {
  const lectures = await listLiveLectures();

  return lectures.filter((lecture) => isLectureDiscoverable(lecture, input));
}

export function getLectureDiscoveryMode(lecture: InstructorLecture): LectureDiscoveryMode {
  return lecture.discoveryMode ?? 'nearby';
}

export function getLectureDistanceMeters(
  lecture: InstructorLecture,
  location?: LectureLocation | null
) {
  if (!lecture.location || !location) {
    return null;
  }

  return getDistanceMeters(location, lecture.location);
}

export function isLectureDiscoverable(
  lecture: InstructorLecture,
  input: {
    location?: LectureLocation | null;
    searchKey?: string;
  }
) {
  const discoveryMode = getLectureDiscoveryMode(lecture);
  const queryValue = normalizeDiscoveryKey(input.searchKey ?? '');
  const keyMatches =
    queryValue.length >= 2 &&
    [lecture.discoveryKey, lecture.code]
      .map((key) => normalizeDiscoveryKey(key ?? ''))
      .filter(Boolean)
      .some((key) => key.includes(queryValue));

  if (discoveryMode === 'search-key') {
    return keyMatches;
  }

  const locationMatches = isLectureNearby(input.location, lecture);

  if (discoveryMode === 'both') {
    return keyMatches || locationMatches;
  }

  return locationMatches;
}

export function doesLectureKeyMatch(lecture: InstructorLecture, searchKey: string) {
  const queryValue = normalizeDiscoveryKey(searchKey);

  if (queryValue.length < 2) {
    return false;
  }

  return [lecture.discoveryKey, lecture.code]
    .map((key) => normalizeDiscoveryKey(key ?? ''))
    .filter(Boolean)
    .some((key) => key.includes(queryValue));
}

export function normalizeDiscoveryKey(value: string) {
  return value.trim().replace(/[^a-z0-9]/gi, '').toUpperCase();
}

export async function getInstructorLecture(lectureId: string) {
  const lectureSnapshot = await getDoc(getLectureRef(lectureId));

  return mapLectureSnapshotWithAttendance(lectureSnapshot);
}

export function subscribeLecture(
  lectureId: string,
  onNext: LectureSnapshotHandler,
  onError?: SnapshotErrorHandler
) {
  let latestLectureSnapshot: DocumentSnapshot<DocumentData> | null = null;
  let latestAttendanceEvents: LectureAttendanceEvent[] = [];

  const emit = () => {
    if (!latestLectureSnapshot) {
      return;
    }

    onNext(mapLectureDoc(latestLectureSnapshot, latestAttendanceEvents));
  };

  const unsubscribeLecture = onSnapshot(
    getLectureRef(lectureId),
    (snapshot) => {
      latestLectureSnapshot = snapshot;
      emit();
    },
    (error) => onError?.(toError(error))
  );
  const unsubscribeAttendance = onSnapshot(
    getAttendanceCollectionRef(lectureId),
    (snapshot) => {
      latestAttendanceEvents = mapAttendanceEvents(snapshot.docs);
      emit();
    },
    (error) => onError?.(toError(error))
  );
  const statusTimer = setInterval(emit, 30000);

  return () => {
    clearInterval(statusTimer);
    unsubscribeAttendance();
    unsubscribeLecture();
  };
}

export async function joinLiveLectureWithPin(lectureId: string, input: JoinLiveLectureInput) {
  const lectureRef = getLectureRef(lectureId);
  const attendanceRef = doc(getAttendanceCollectionRef(lectureId), input.studentId);

  await runTransaction(db, async (transaction) => {
    const lectureSnapshot = await transaction.get(lectureRef);

    if (!lectureSnapshot.exists()) {
      throw new Error('This session is no longer available.');
    }

    const lecture = mapLectureDoc(lectureSnapshot);

    if (!lecture) {
      throw new Error('This session is no longer available.');
    }

    if (lecture.status === 'scheduled') {
      throw new Error('This attendance session is not open yet.');
    }

    if (lecture.status === 'ended') {
      transaction.update(lectureRef, {
        endedAt: lecture.endedAt ?? new Date().toISOString(),
        status: 'ended',
      });
      throw new Error('This attendance session is closed.');
    }

    if (lecture.sessionPin !== input.pin.trim()) {
      throw new Error('The session PIN is incorrect.');
    }

    const attendanceSnapshot = await transaction.get(attendanceRef);
    const existingEvent = attendanceSnapshot.exists()
      ? mapAttendanceDoc(attendanceSnapshot)
      : null;
    const checkedInAt = new Date().toISOString();
    const checkInCount = (existingEvent?.checkInCount ?? (existingEvent ? 1 : 0)) + 1;
    const nextEvent: LectureAttendanceEvent = {
      checkedInAt,
      checkInCount,
      email: input.studentEmail ?? existingEvent?.email ?? null,
      firstCheckedInAt: existingEvent?.firstCheckedInAt ?? existingEvent?.checkedInAt ?? checkedInAt,
      id: input.studentId,
      name: input.studentName,
      status: checkInCount === 1 ? 'Entered 1 time' : `Entered ${checkInCount} times`,
    };

    transaction.set(attendanceRef, nextEvent);
    transaction.update(lectureRef, compactObject({
      attendanceCount: attendanceSnapshot.exists() ? lecture.attendanceCount : increment(1),
      status: 'live',
    }));
  });

  const joinedLecture = await getInstructorLecture(lectureId);

  if (!joinedLecture) {
    throw new Error('This session is no longer available.');
  }

  return joinedLecture;
}

export async function endLiveAttendanceSession(
  lectureId: string,
  input: EndLiveAttendanceInput
): Promise<InstructorLecture | null> {
  await updateDoc(getLectureRef(lectureId), {
    attendanceCount: input.attendanceCount,
    endedAt: new Date().toISOString(),
    status: 'ended',
  });

  return getInstructorLecture(lectureId);
}

function getLectureRef(lectureId: string) {
  return doc(db, LECTURES_COLLECTION, lectureId);
}

function getAttendanceCollectionRef(lectureId: string) {
  return collection(db, LECTURES_COLLECTION, lectureId, ATTENDANCE_COLLECTION);
}

function mapLectureDoc(
  snapshot: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>,
  attendanceEvents?: LectureAttendanceEvent[]
) {
  if (!snapshot.exists()) {
    return null;
  }

  return mapLectureData(snapshot.id, snapshot.data(), attendanceEvents);
}

async function mapLectureWithAttendance(
  snapshot: QueryDocumentSnapshot<DocumentData>
) {
  const attendanceSnapshot = await getDocs(getAttendanceCollectionRef(snapshot.id));

  return mapLectureDoc(snapshot, mapAttendanceEvents(attendanceSnapshot.docs));
}

async function mapLectureSnapshotWithAttendance(snapshot: DocumentSnapshot<DocumentData>) {
  if (!snapshot.exists()) {
    return null;
  }

  const attendanceSnapshot = await getDocs(getAttendanceCollectionRef(snapshot.id));

  return mapLectureDoc(snapshot, mapAttendanceEvents(attendanceSnapshot.docs));
}

function mapLectureData(
  id: string,
  data: DocumentData,
  attendanceEvents: LectureAttendanceEvent[] = []
): InstructorLecture {
  const syncedLecture = syncLectureStatus(
    {
      attendanceCount:
        attendanceEvents.length > 0 ? attendanceEvents.length : readNumber(data.attendanceCount, 0),
      attendanceEvents,
      code: readString(data.code, id.slice(0, 8).toUpperCase()),
      createdAt: readString(data.createdAt, new Date().toISOString()),
      days: readStringArray(data.days),
      discoveryKey: readOptionalString(data.discoveryKey),
      discoveryMode: readDiscoveryMode(data.discoveryMode),
      durationMinutes: readDurationMinutes(data.durationMinutes),
      endTime: readString(data.endTime, '--'),
      endedAt: readOptionalString(data.endedAt),
      id,
      instructorEmail: readNullableString(data.instructorEmail),
      instructorId: readString(data.instructorId, 'unknown-instructor'),
      launchMode: readLaunchMode(data.launchMode),
      location: readLocation(data.location),
      scheduledEndAt: readOptionalString(data.scheduledEndAt),
      scheduledStartAt: readOptionalString(data.scheduledStartAt),
      sessionPin: readString(data.sessionPin, ''),
      startTime: readString(data.startTime, '--'),
      status: readLectureStatus(data.status),
      title: readString(data.title, 'Lecture'),
      visibilityRadiusMeters: readOptionalNumber(data.visibilityRadiusMeters),
    },
    new Date()
  );

  return syncedLecture;
}

function mapAttendanceEvents(snapshots: QueryDocumentSnapshot<DocumentData>[]) {
  return snapshots
    .map(mapAttendanceDoc)
    .sort((first, second) => second.checkedInAt.localeCompare(first.checkedInAt));
}

function mapAttendanceDoc(
  snapshot: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>
): LectureAttendanceEvent {
  const data = snapshot.exists() ? snapshot.data() : {};

  return {
    checkedInAt: readString(data.checkedInAt, new Date().toISOString()),
    checkInCount: readOptionalNumber(data.checkInCount),
    email: readNullableString(data.email),
    firstCheckedInAt: readOptionalString(data.firstCheckedInAt),
    id: readString(data.id, snapshot.id),
    name: readString(data.name, 'Student'),
    status: readString(data.status, 'Entered 1 time'),
  };
}

function sortLectures(lectures: InstructorLecture[]) {
  return [...lectures].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  );
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function readOptionalString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNullableString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readOptionalNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function readDurationMinutes(value: unknown): LectureDurationMinutes {
  return value === 90 ? 90 : 60;
}

function readDiscoveryMode(value: unknown): LectureDiscoveryMode {
  return value === 'search-key' || value === 'both' ? value : 'nearby';
}

function readLaunchMode(value: unknown): LectureLaunchMode {
  return value === 'scheduled' ? 'scheduled' : 'now';
}

function readLectureStatus(value: unknown): LectureSessionStatus {
  return value === 'scheduled' || value === 'ended' ? value : 'live';
}

function readLocation(value: unknown): LectureLocation | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const location = value as Record<string, unknown>;
  const latitude = location.latitude;
  const longitude = location.longitude;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return undefined;
  }

  return {
    accuracy: readOptionalNumber(location.accuracy) ?? null,
    capturedAt: readString(location.capturedAt, new Date().toISOString()),
    latitude,
    longitude,
  };
}

function toError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  const firestoreError = error as FirestoreError;
  return new Error(firestoreError?.message ?? 'Firestore request failed.');
}

function getImmediateScheduleWindow(durationMinutes: LectureDurationMinutes, now: Date) {
  const startDate = new Date(now);
  const endDate = addMinutes(startDate, durationMinutes);

  return {
    endDate,
    endTime: formatClockFromDate(endDate),
    startDate,
    startTime: formatClockFromDate(startDate),
  };
}

function getScheduledWindow(
  days: string[],
  startTime: string,
  durationMinutes: LectureDurationMinutes,
  now: Date
) {
  const parsedTime = parseClockTime(startTime);

  if (!parsedTime) {
    return null;
  }

  const activeDays = days.length ? days : [weekDayLabels[now.getDay()]];

  for (let dayOffset = 0; dayOffset <= 14; dayOffset += 1) {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + dayOffset);
    startDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

    if (!activeDays.includes(weekDayLabels[startDate.getDay()])) {
      continue;
    }

    const endDate = addMinutes(startDate, durationMinutes);

    if (endDate.getTime() > now.getTime()) {
      return {
        endDate,
        endTime: formatClockFromDate(endDate),
        startDate,
        startTime: formatClockFromDate(startDate),
      };
    }
  }

  return null;
}

function syncLectureStatus(lecture: InstructorLecture, now: Date) {
  if (lecture.status === 'ended' || !lecture.scheduledStartAt || !lecture.scheduledEndAt) {
    return lecture;
  }

  const startDate = new Date(lecture.scheduledStartAt);
  const endDate = new Date(lecture.scheduledEndAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return lecture;
  }

  const nextStatus = getStatusForWindow(startDate, endDate, now);

  if (nextStatus === lecture.status) {
    return lecture;
  }

  return {
    ...lecture,
    endedAt: nextStatus === 'ended' ? endDate.toISOString() : lecture.endedAt,
    status: nextStatus,
  };
}

function getStatusForWindow(startDate: Date, endDate: Date, now: Date): LectureSessionStatus {
  if (now.getTime() < startDate.getTime()) {
    return 'scheduled';
  }

  if (now.getTime() >= endDate.getTime()) {
    return 'ended';
  }

  return 'live';
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function isLectureNearby(location: LectureLocation | null | undefined, lecture: InstructorLecture) {
  if (!lecture.location) {
    return true;
  }

  if (!location) {
    return false;
  }

  const radius = lecture.visibilityRadiusMeters ?? DEFAULT_DISCOVERY_RADIUS_METERS;
  return getDistanceMeters(location, lecture.location) <= radius;
}

function getDistanceMeters(first: LectureLocation, second: LectureLocation) {
  const earthRadiusMeters = 6371000;
  const firstLatitude = toRadians(first.latitude);
  const secondLatitude = toRadians(second.latitude);
  const latitudeDelta = toRadians(second.latitude - first.latitude);
  const longitudeDelta = toRadians(second.longitude - first.longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function formatClockFromDate(date: Date) {
  return formatClockTime(date.getHours() * 60 + date.getMinutes());
}

function parseClockTime(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);

  if (!match) {
    return null;
  }

  const rawHours = Number(match[1]);
  const minutes = Number(match[2] ?? '0');
  const period = match[3]?.toUpperCase();

  if (minutes > 59 || rawHours > (period ? 12 : 23) || rawHours < 0) {
    return null;
  }

  if (!period) {
    return { hours: rawHours, minutes };
  }

  const hours = period === 'AM' ? rawHours % 12 : (rawHours % 12) + 12;
  return { hours, minutes };
}

function formatClockTime(totalMinutes: number) {
  const minutesInDay = 24 * 60;
  const normalizedMinutes = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hours24 = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function buildLectureCode(title: string) {
  const prefix =
    title
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .replace(/[^a-z0-9]/gi, '')
      .slice(0, 3)
      .toUpperCase() || 'LEC';

  return `${prefix}-${String(Date.now()).slice(-4)}`;
}
