import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UsersTableRow from './UsersTableRow';
import RegisterUserModal from './usersModals/RegisterUserModal.jsx';
import { getUsers } from '../../../store/state/actions/userActions';

const UsersTable = () => {
  const userList = useSelector((state) => state.users.userList);
  const roleList = useSelector((state) => state.role.roleList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (refresh = false) => {
    setIsModalOpen(false);
    if (refresh) {
      dispatch(getUsers());
    }
  };

  return (
      <>
        <button onClick={handleOpenModal}>Create User</button>
        <RegisterUserModal open={isModalOpen} onClose={handleCloseModal} />
        <table className="table">
          <thead>
          <tr>
            <th>Ім&#39;я</th>
            <th>Email</th>
            <th>Ролі</th>
            <th>Аватар</th>
            <th>Дії</th>
          </tr>
          </thead>
          <tbody>
          {userList.map((user) => (
              <UsersTableRow key={user.id} user={user} roleList={roleList} />
          ))}
          </tbody>
        </table>
      </>
  );
};

export default React.memo(UsersTable);