export const instructorSummary = {
  activeLectures: 4,
  attendanceRate: '93%',
  liveStudents: 38,
};

export const instructorLectureCards = [
  {
    code: 'CS401',
    room: 'Lab 4A',
    roster: '38 expected',
    startTime: '09:00 AM',
    status: 'Live Now',
    title: 'Distributed Systems',
  },
  {
    code: 'CS315',
    room: 'Hall C2',
    roster: '54 enrolled',
    startTime: '11:30 AM',
    status: 'Starts Soon',
    title: 'Database Systems',
  },
];

export const liveAttendanceParticipants = [
  { id: 's-1', name: 'Afnan Hussein', status: 'Checked in 12 sec ago' },
  { id: 's-2', name: 'Lina Omar', status: 'Checked in 24 sec ago' },
  { id: 's-3', name: 'Rakan Faisal', status: 'Checked in 41 sec ago' },
  { id: 's-4', name: 'Sara Ibrahim', status: 'Checked in 1 min ago' },
];

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const;
