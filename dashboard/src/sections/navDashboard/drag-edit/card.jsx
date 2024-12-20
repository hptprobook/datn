/* eslint-disable import/no-extraneous-dependencies */
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';
import { IconButton } from '@mui/material';
import { ItemTypes } from './item-types';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

export const Card = ({ id, text, index, moveCard, icon, onDelete }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <Iconify icon={icon} width={20} height={20} sx={{ mr: 2 }} />
      {text}
      <IconButton
        aria-label="load"
        variant="contained"
        color="inherit"
        onClick={onDelete}
      >
        <Iconify icon="eva:trash-fill" />
      </IconButton>
    </div>
  );
};

Card.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  icon: PropTypes.any,
  onDelete: PropTypes.func,
};
