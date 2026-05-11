import { Linking, Platform } from 'react-native';

import { InstructorLecture } from './lecture-session.service';

export type AttendanceReportExportResult = {
  fileName: string;
  rowCount: number;
};

export async function exportLectureAttendanceReport(
  lecture: InstructorLecture
): Promise<AttendanceReportExportResult> {
  const fileName = `${toFileSafeName(lecture.title)}-${lecture.code}-attendance.csv`;
  const csv = buildAttendanceCsv(lecture);

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = fileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  } else {
    await Linking.openURL(`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  }

  return {
    fileName,
    rowCount: lecture.attendanceEvents.length,
  };
}

function buildAttendanceCsv(lecture: InstructorLecture) {
  const metadataRows = [
    ['Lecture', lecture.title],
    ['Code', lecture.code],
    ['Instructor', lecture.instructorEmail ?? 'Not available'],
    ['Time', `${lecture.startTime} - ${lecture.endTime}`],
    ['Status', lecture.status],
    ['Checked In', String(lecture.attendanceCount)],
    [],
  ];
  const headerRow = [
    'Student Name',
    'Student ID',
    'Email',
    'Status',
    'Entered This Lecture',
    'First Check-In',
    'Latest Check-In',
  ];
  const attendanceRows = lecture.attendanceEvents.map((event) => [
    event.name,
    event.id,
    event.email ?? '',
    event.status,
    String(event.checkInCount ?? 1),
    formatExportDate(event.firstCheckedInAt ?? event.checkedInAt),
    formatExportDate(event.checkedInAt),
  ]);

  return `\uFEFF${[...metadataRows, headerRow, ...attendanceRows].map(toCsvRow).join('\n')}`;
}

function toCsvRow(values: Array<string | undefined>) {
  return values.map((value) => escapeCsvValue(value ?? '')).join(',');
}

function escapeCsvValue(value: string) {
  const normalizedValue = value.replace(/\r?\n/g, ' ');

  if (!/[",\n]/.test(normalizedValue)) {
    return normalizedValue;
  }

  return `"${normalizedValue.replace(/"/g, '""')}"`;
}

function formatExportDate(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString();
}

function toFileSafeName(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'lecture'
  );
}
