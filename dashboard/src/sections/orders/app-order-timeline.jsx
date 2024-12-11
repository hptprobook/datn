import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------
const getStatusReturn = (status) => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'approved':
      return 'Chấp nhận';
    case 'rejected':
      return 'Từ chối';
    default:
      return '';
  }
};

export default function OrderTimeline({ title, subheader, list, ...other }) {
  const newList = [...list].reverse();

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {newList.map((item, index) => (
          <OrderItem key={index} item={item} lastTimeline={index === newList.length - 1} />
        ))}
      </Timeline>
    </Card>
  );
}

OrderTimeline.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function OrderItem({ item, lastTimeline }) {
  const { status, note, createdAt, returnStatus } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (status === 'pending' && 'primary') ||
            (status === 'shipping' && 'primary') ||
            (status === 'shipped' && 'info') ||
            (status === 'paymentPending' && 'info') ||
            (status === 'delivered' && 'success') ||
            (status === 'completed' && 'success') ||
            (status === 'confirmed' && 'info') ||
            (status === 'returned' && 'warning') ||
            'error'
          }
        />
        {lastTimeline ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{note}</Typography>
        <Typography variant="subtitle2">{getStatusReturn(returnStatus)}</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDateTime(createdAt)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object,
  lastTimeline: PropTypes.bool,
};
