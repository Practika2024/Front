import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { UserService } from '../../../../utils/services';
import { getUsers } from '../../../../store/state/actions/userActions';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('Некоректний формат email').required('Email обов\'язковий'),
  password: yup.string().min(8, 'Пароль має містити щонайменше 8 символів').required('Введіть пароль'),
  name: yup.string().trim().required('Ім\'я обов\'язкове').max(50, 'Ім\'я не може перевищувати 50 символів'),
  surname: yup.string().max(50, 'Прізвище не може перевищувати 50 символів'),
  patronymic: yup.string().max(50, 'По батькові не може перевищувати 50 символів'),
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
      toast.success('Користувача успішно зареєстровано.');
      dispatch(getUsers()); // Refresh the user list after creating a new user
      onClose();
    } catch (validationErrors) {
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          toast.error(error.message);
        });
      } else {
        toast.error('Не вдалося зареєструвати користувача.');
      }
    }
  };

  return (
      <Modal open={open} onClose={() => onClose(false)}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit}>
            <TextField label="Ім'я" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Прізвище" name="surname" value={formData.surname} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="По батькові" name="patronymic" value={formData.patronymic} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Пароль" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Зареєструвати
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
