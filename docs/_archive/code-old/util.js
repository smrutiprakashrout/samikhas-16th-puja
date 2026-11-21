export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (start, end, amount) => start + (end - start) * amount;

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ics(eventObj, venueLines = []) {
  const start = new Date(eventObj.startISO);
  const end = new Date(start.getTime() + Number(eventObj.durationMin || 0) * 60000);
  const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const escape = (value) => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invite Site//EN', 'BEGIN:VEVENT', `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${escape(eventObj.title || '')}`, `LOCATION:${escape(venueLines.join(', '))}`, 'END:VEVENT', 'END:VCALENDAR'];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'invitation.ics';
  link.click();
  URL.revokeObjectURL(url);
}
