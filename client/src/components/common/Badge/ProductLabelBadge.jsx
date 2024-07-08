/* eslint-disable indent */
export default function ProductLabelBadge({ text }) {
  const bgColor =
    text === 'Bán chạy'
      ? 'bg-red-600'
      : text === 'Free Ship'
      ? 'bg-green-600'
      : 'bg-gray-600';

  return (
    <div className={`px-2 py-1 ${bgColor} text-white rounded-xs text-xs`}>
      {text}
    </div>
  );
}
