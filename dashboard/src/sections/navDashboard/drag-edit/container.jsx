/* eslint-disable import/no-extraneous-dependencies */
import update from 'immutability-helper';
import { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import { Card } from './card';

const style = {
  width: '100%',
};
export const ContainerDragDrop = ({ nav }) => {
  const [cards, setCards] = useState(nav);
  useEffect(() => {
    setCards(nav);
  }, [nav]);
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);
const handleSave = () => {
    const newNav = cards.map((item, index) => ({
        _id: item._id,
        index,
    }));
    console.log(newNav);
    console.log(cards)
};
  const renderCard = useCallback(
    (card, index) => (
      <Card
        key={card.index}
        index={index}
        id={card.index}
        text={card.title}
        icon={card.icon}
        moveCard={moveCard}
      />
    ),
    [moveCard]
  );
  return (
    <div style={style}>
      {cards.map((card, i) => renderCard(card, i))}
      <Button variant="contained" fullWidth color="inherit" onClick={handleSave} startIcon={<Iconify icon="eva:save-fill" />}>
        Lưu
      </Button>
    </div>
  );
};
ContainerDragDrop.propTypes = {
  nav: PropTypes.array,
};
