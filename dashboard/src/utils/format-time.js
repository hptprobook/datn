import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi'; // Import ngôn ngữ tiếng Việt
// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi')
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

export function formatDateTime(timestamp, type = 'datetime') {
  if (!dayjs(timestamp).isValid()) {
    return 'Không rõ';
  }
  if (type === 'date') {
    return dayjs(timestamp).format('DD/MM/YYYY');
  }
  if (type === 'time') {
    return dayjs(timestamp).format('HH:mm:ss');
  }
  return dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss');
}
