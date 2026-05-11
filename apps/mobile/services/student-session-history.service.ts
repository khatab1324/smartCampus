import {
  collectionGroup,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { db } from './firebase';
import { InstructorLecture } from './lecture-session.service';

export type StudentSessionHistoryEntry = {
  enteredAt: string;
  instructorEmail?: string | null;
  lectureCode: string;
  lectureId: string;
  studentId: string;
  title: string;
  time: string;
};

type HistorySnapshotHandler = (entries: StudentSessionHistoryEntry[]) => void;
type HistoryErrorHandler = (error: Error) => void;

const ATTENDANCE_COLLECTION = 'attendance';

export async function recordStudentSessionEntry(studentId: string, lecture: InstructorLecture) {
  return buildHistoryEntryFromLecture(studentId, lecture);
}

export async function listStudentSessionHistory(studentId: string) {
  const snapshot = await getDocs(getStudentAttendanceQuery(studentId));
  const entries = await Promise.all(snapshot.docs.map(mapAttendanceHistoryDoc));

  return sortHistoryEntries(
    entries.filter((entry): entry is StudentSessionHistoryEntry => Boolean(entry))
  );
}

export function subscribeStudentSessionHistory(
  studentId: string,
  onNext: HistorySnapshotHandler,
  onError?: HistoryErrorHandler
) {
  let version = 0;

  const unsubscribe = onSnapshot(
    getStudentAttendanceQuery(studentId),
    (snapshot) => {
      const currentVersion = version + 1;
      version = currentVersion;

      void Promise.all(snapshot.docs.map(mapAttendanceHistoryDoc))
        .then((entries) => {
          if (currentVersion !== version) {
            return;
          }

          onNext(
            sortHistoryEntries(
              entries.filter((entry): entry is StudentSessionHistoryEntry => Boolean(entry))
            )
          );
        })
        .catch((error) => onError?.(toError(error)));
    },
    (error) => onError?.(toError(error))
  );

  return unsubscribe;
}

function getStudentAttendanceQuery(studentId: string) {
  return query(collectionGroup(db, ATTENDANCE_COLLECTION), where('id', '==', studentId));
}

async function mapAttendanceHistoryDoc(
  snapshot: QueryDocumentSnapshot<DocumentData>
): Promise<StudentSessionHistoryEntry | null> {
  const lectureRef = snapshot.ref.parent.parent;

  if (!lectureRef) {
    return null;
  }

  const lectureSnapshot = await getDoc(lectureRef);

  if (!lectureSnapshot.exists()) {
    return null;
  }

  const attendanceData = snapshot.data();
  const lectureData = lectureSnapshot.data();
  const studentId = readString(attendanceData.id, snapshot.id);

  return {
    enteredAt: readString(
      attendanceData.firstCheckedInAt,
      readString(attendanceData.checkedInAt, new Date().toISOString())
    ),
    instructorEmail: readNullableString(lectureData.instructorEmail),
    lectureCode: readString(lectureData.code, lectureSnapshot.id.slice(0, 8).toUpperCase()),
    lectureId: lectureSnapshot.id,
    studentId,
    time: `${readString(lectureData.startTime, '--')} - ${readString(lectureData.endTime, '--')}`,
    title: readString(lectureData.title, 'Lecture'),
  };
}

function buildHistoryEntryFromLecture(
  studentId: string,
  lecture: InstructorLecture
): StudentSessionHistoryEntry {
  const attendanceEvent = lecture.attendanceEvents.find((event) => event.id === studentId);

  return {
    enteredAt:
      attendanceEvent?.firstCheckedInAt ??
      attendanceEvent?.checkedInAt ??
      new Date().toISOString(),
    instructorEmail: lecture.instructorEmail,
    lectureCode: lecture.code,
    lectureId: lecture.id,
    studentId,
    time: `${lecture.startTime} - ${lecture.endTime}`,
    title: lecture.title,
  };
}

function sortHistoryEntries(entries: StudentSessionHistoryEntry[]) {
  return [...entries].sort((first, second) => second.enteredAt.localeCompare(first.enteredAt));
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function readNullableString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function toError(error: unknown) {
  return error instanceof Error ? error : new Error('Could not load attendance history.');
}
