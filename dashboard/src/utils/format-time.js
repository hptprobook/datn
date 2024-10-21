import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'DD MMM YYYY';
  return date ? dayjs(date).format(fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'DD MMM YYYY h:mm A';
  return date ? dayjs(date).format(fm) : '';
}

export function fTimestamp(date) {
  return date ? dayjs(date).valueOf() : '';
}

export function fToNow(date) {
  return date ? dayjs(date).fromNow() : '';
}

export function formatDateTime(timestamp) {
  if (!dayjs(timestamp).isValid()) {
    return 'Không rõ';
  }
  return dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss');
}
