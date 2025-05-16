import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UsersTableRow from './UsersTableRow';
import RegisterUserModal from './usersModals/RegisterUserModal.jsx';
import { getUsers } from '../../../store/state/actions/userActions';
import { Button } from 'react-bootstrap';

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="primary" onClick={handleOpenModal}>
          Додати користувача
        </Button>
      </div>

      {userList.length === 0 ? (
        <div className="table-empty-state">Користувачі відсутні</div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th className="text-center">Ім'я</th>
              <th className="text-center">Email</th>
              <th className="text-center">Ролі</th>
              <th className="text-center" style={{ width: '100px' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <UsersTableRow key={user.id} user={user} roleList={roleList} />
            ))}
          </tbody>
        </table>
      )}

      <RegisterUserModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default React.memo(UsersTable);