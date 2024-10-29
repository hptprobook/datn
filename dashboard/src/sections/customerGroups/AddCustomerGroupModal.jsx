import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from 'src/redux/slices/userSlice';
import { handleToast } from 'src/hooks/toast';

export default function AddCustomerGroupModal({ open, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');

    const [users, setUsers] = useState([]);
    const statusUser = useSelector((state) => state.users.status);
    const errorUser = useSelector((state) => state.users.error);
    const dataUser = useSelector((state) => state.users.users);
    const dispatch = useDispatch();

    useEffect(() => {
        if (statusUser === 'idle') {
            dispatch(fetchAllUsers());
        } else if (statusUser === 'failed') {
            console.error(errorUser);
        } else if (statusUser === 'successful') {
            setUsers(dataUser.users || []);
        }
    }, [statusUser, dispatch, errorUser, dataUser]);

    const handleUserChange = (event) => {
        const userId = event.target.value;
        setSelectedUserId(userId);
        const selectedUser = users.find((user) => user._id === userId);
        if (selectedUser) {
            setName(selectedUser.name || '');
            setPhone(selectedUser.phone || '');
            setEmail(selectedUser.email || '');
        }
    };

    const handleAdd = () => {
        if (name === '' || phone === '' || email === '') {
          handleToast('error', 'Vui lòng nhập đầy đủ thông tin');
          return;
        }
    
        const customerData = [{ id: selectedUserId, name, phone, email }];
        onAdd(customerData);
    
        setName('');
        setPhone('');
        setEmail('');
        setSelectedUserId('');
        onClose();
      };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm khách hàng</DialogTitle>
            <DialogContent>
                <Select
                    value={selectedUserId || ''}
                    onChange={handleUserChange}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="" disabled>
                        Chọn khách hàng
                    </MenuItem>
                    {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                            {user.name}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    margin="dense"
                    label="Tên khách hàng"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Số điện thoại"
                    type="text"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Huỷ</Button>
                <Button onClick={handleAdd} color="primary">
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AddCustomerGroupModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
};