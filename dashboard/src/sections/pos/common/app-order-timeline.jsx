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
const styleOverFlow = {
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px', // Width for vertical scrollbar
    height: '8px', // Height for horizontal scrollbar
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c4c4c4', // Color of the scrollbar thumb
    borderRadius: '4px', // Rounded edges
    '&:hover': {
      backgroundColor: '#a0a0a0', // Darker color on hover
    },
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f0f0f0', // Background color of the track
    borderRadius: '4px', // Rounded edges
  },
};
export default function AnalyticsOrderTimeline({ title, subheader, list, ...other }) {
  return (
    <Card
      {...other}
      sx={{
        maxHeight: 500,
        ...styleOverFlow,
      }}
    >
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
        {list.map((item, index) => (
          <OrderItem key={index} item={item} lastTimeline={index === list.length - 1} />
        ))}
      </Timeline>
    </Card>
  );
}

AnalyticsOrderTimeline.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function OrderItem({ item, lastTimeline }) {
  const { title, createdAt, description } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color="primary" />
        {lastTimeline ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="subtitle2">{description}</Typography>
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
