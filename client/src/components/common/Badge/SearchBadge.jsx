import { Badge } from 'flowbite-react';

export default function SearchBadge({ text, onClick = () => {} }) {
  return (
    <Badge onClick={onClick} color="gray">
      {text}
    </Badge>
  );
}
