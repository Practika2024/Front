import React from 'react';
import { useSelector } from 'react-redux';
import UsersTableRow from './UsersTableRow';
import { useRenderCount } from '../../../hooks/useRenderCount';

const UsersTable = () => {
  const userList = useSelector((state) => state.users.userList);
  const roleList = useSelector((state) => state.role.roleList);

  const renderCount = useRenderCount();

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Avatar</th>
            <th>Actions</th>
            <th>Render Count</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <UsersTableRow key={user.id} user={user} roleList={roleList} />
          ))}
        </tbody>
      </table>
      <h5>UsersTable render count: {renderCount}</h5>
    </>
  );
};

export default React.memo(UsersTable);
