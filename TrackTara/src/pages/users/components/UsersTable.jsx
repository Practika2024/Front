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
        <div className="d-flex justify-content-center justify-content-sm-start mb-3">
          <button className="btn btn-dark" onClick={handleOpenModal}>
            Створити користувача
          </button>
        </div>
        <RegisterUserModal open={isModalOpen} onClose={handleCloseModal} />
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
            <tr>
              <th>Ім&#39;я</th>
              <th>Email</th>
              <th>Ролі</th>
              <th>Позначка ролі</th>
              <th>Дії</th>
            </tr>
            </thead>
            <tbody>
            {userList.map((user) => (
                <UsersTableRow key={user.id} user={user} roleList={roleList} />
            ))}
            </tbody>
          </table>
        </div>
      </>
  );
};

export default React.memo(UsersTable);