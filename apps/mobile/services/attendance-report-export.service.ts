import { File, Paths } from 'expo-file-system';
import { getContentUriAsync } from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';

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
    const file = downloadCsvToAppDocuments(fileName, csv);

    await openDownloadedCsv(file);
  }

  return {
    fileName,
    rowCount: lecture.attendanceEvents.length,
  };
}

function downloadCsvToAppDocuments(fileName: string, csv: string) {
  const file = new File(Paths.document, fileName);

  file.create({ overwrite: true });
  file.write(csv);

  return file;
}

async function openDownloadedCsv(file: File) {
  if (Platform.OS !== 'android') {
    return;
  }

  const contentUri = await getContentUriAsync(file.uri);

  try {
    await openAndroidFile(contentUri, 'text/csv');
  } catch {
    try {
      await openAndroidFile(contentUri, 'application/vnd.ms-excel');
    } catch {
      throw new Error('Report downloaded, but no spreadsheet app could open it.');
    }
  }
}

async function openAndroidFile(contentUri: string, mimeType: string) {
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: 1,
    type: mimeType,
  });
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
