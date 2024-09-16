/* eslint-disable import/no-extraneous-dependencies */
import update from 'immutability-helper';
import { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useDispatch } from 'react-redux';
import { removeNav, updateMutipleNav } from 'src/redux/slices/settingSlices';
import { Card } from './card';

const style = {
  width: '100%',
};
export const ContainerDragDrop = ({ nav }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');

  const [cards, setCards] = useState(nav);
  useEffect(() => {
    setCards(nav);
  }, [nav]);
  const handleDelete = useCallback((_id) => {
    // dispatch(removeNav({ id }));
    setId(_id);
    setOpen(true);
  }, []);
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
    dispatch(updateMutipleNav({ values: newNav }));
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
        onDelete={() => handleDelete(card._id)}
      />
    ),
    [moveCard, handleDelete]
  );

  const handleClose = () => {
    setOpen(false);
  };
  const handleAgree = () => {
    dispatch(removeNav({ id }));
    setId('');
    setOpen(false);
  };
  return (
    <div style={style}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa menu này?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Các hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Hủy
          </Button>
          <Button color="inherit" variant="contained" onClick={handleAgree} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      {cards.map((card, i) => renderCard(card, i))}
      <Button
        variant="contained"
        fullWidth
        color="inherit"
        onClick={handleSave}
        startIcon={<Iconify icon="eva:save-fill" />}
      >
        Lưu
      </Button>
    </div>
  );
};
ContainerDragDrop.propTypes = {
  nav: PropTypes.array,
};
