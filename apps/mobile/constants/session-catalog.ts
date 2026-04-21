import { SessionRecord } from '@/types/session';

export const sessionCatalog: SessionRecord[] = [
  {
    activeAttendance: 28,
    attendeeOverflow: '+14',
    attendeePreview: ['MK', 'SA'],
    code: 'Lec-402',
    crn: '884021',
    cta: 'Join',
    department: 'Dept. of Engineering',
    description:
      'Theoretical frameworks for autonomous kinematics and sensory integration in complex environments.',
    hint: 'Attendance window opens at 09:55 AM',
    lecturer: 'Dr. Aris Thorne',
    locationDetail: 'West Wing, 4th Floor',
    locationLabel: 'Lab Alpha, Room 402',
    proximityText: 'Hall A within range',
    remainingMinutes: 45,
    room: 'Room Hall A',
    signalStrength: 'strong',
    status: 'Starts in 5m',
    time: '10:30 AM - 12:45 PM',
    title: 'Advanced Robotics 402',
  },
  {
    activeAttendance: 24,
    attendeeOverflow: '+9',
    attendeePreview: ['LJ', 'RT'],
    code: 'Lec-310',
    crn: '884089',
    cta: 'Select',
    department: 'Dept. of Engineering',
    description:
      'Advanced signal analysis, frequency-domain modeling, and sampling techniques for embedded systems.',
    hint: 'Passcode was refreshed 2 minutes ago',
    lecturer: 'Prof. Sarah Jenkins',
    locationDetail: 'Central Wing, 3rd Floor',
    locationLabel: 'Signal Lab, Room 310',
    proximityText: 'Hall C within range',
    remainingMinutes: 52,
    room: 'Room Hall C',
    signalStrength: 'medium',
    status: 'Ongoing (15m in)',
    time: '12:00 PM - 01:30 PM',
    title: 'Digital Signal Processing',
  },
];

export function getSessionByCode(code?: string | string[]) {
  const sessionCode = Array.isArray(code) ? code[0] : code;

  return sessionCatalog.find((session) => session.code === sessionCode) ?? sessionCatalog[0];
}
