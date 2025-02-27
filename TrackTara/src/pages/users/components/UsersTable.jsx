import React from 'react';
import { useSelector } from 'react-redux';
import UsersTableRow from './UsersTableRow';
import { useRenderCount } from '../../../hooks/useRenderCount';

const UsersTable = () => {
  const userList = useSelector((state) => state.users.userList);
  const roleList = useSelector((state) => state.role.roleList);


  return (
    <>
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
