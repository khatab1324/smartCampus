export function getDisplayNameFromEmail(email: string) {
  const localPart = email.split('@')[0] || 'Smart Campus';
  const segments = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));

  return segments.length ? segments.join(' ') : 'Smart Campus';
}

export function getInitialsFromEmail(email: string) {
  return getDisplayNameFromEmail(email)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join('');
}
