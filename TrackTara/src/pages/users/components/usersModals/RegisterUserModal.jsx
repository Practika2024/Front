import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { UserService } from '../../../../utils/services/UserService';
import { getUsers } from '../../../../store/state/actions/userActions';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters long').required('Enter your password'),
  name: yup.string().trim().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
  surname: yup.string().max(50, 'Surname cannot exceed 50 characters'),
  patronymic: yup.string().max(50, 'Patronymic cannot exceed 50 characters'),
});

const RegisterUserModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      await UserService.createUser(formData);
      toast.success('User registered successfully.');
      dispatch(getUsers()); // Refresh the user list after creating a new user
      onClose();
    } catch (validationErrors) {
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          toast.error(error.message);
        });
      } else {
        toast.error('Failed to register user.');
      }
    }
  };

  return (
      <Modal open={open} onClose={() => onClose(false)}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Surname" name="surname" value={formData.surname} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Patronymic" name="patronymic" value={formData.patronymic} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </form>
        </Box>
      </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

RegisterUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RegisterUserModal;
