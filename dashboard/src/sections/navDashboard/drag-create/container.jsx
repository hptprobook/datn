/* eslint-disable import/no-extraneous-dependencies */
import update from 'immutability-helper';
import { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Card } from './card';

const style = {
  width: '100%',
};
export const ContainerDragDropCreate = ({ nav, onUpdateChild, getNewNav }) => {
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
  useEffect(() => {
    getNewNav(cards);
  }, [cards, getNewNav]);

  const handleDelete = useCallback(
    (index) => {
      onUpdateChild(index);
    },
    [onUpdateChild]
  );
  const renderCard = useCallback(
    (card, index) => (
      <Card
        key={card.index}
        index={index}
        id={card.index}
        text={card.title}
        icon={card.icon}
        moveCard={moveCard}
        onDelete={handleDelete}
      />
    ),
    [moveCard, handleDelete]
  );
  return <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>;
};
ContainerDragDropCreate.propTypes = {
  nav: PropTypes.array,
  onUpdateChild: PropTypes.func,
  getNewNav: PropTypes.func,
};
