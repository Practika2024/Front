import React, { useCallback, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import userImage from "../../../hooks/userImage";
import DeleteUserModal from "./usersModals/DeleteUserModal";
import { useRenderCount } from "../../../hooks/useRenderCount";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";

const UsersTableRow = React.memo(
  ({ user, roleList }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { changeRoles, getUsers, getRolesData } = useActions();
    const renderCount = useRenderCount();

    const closeModal = useCallback(() => {
      setShowDeleteModal(false);
    }, []);

    const handleRoleChange = useCallback(
      async (event, newRoles) => {
        event.preventDefault();
        const roles = newRoles.map((role) => ({ name: role.name }));

        try {
          const result = await changeRoles(user.id, roles);

          if (result.success) {
            await getUsers();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error("Failed to change roles.");
        }
      },
      [user.id, changeRoles, getUsers, getRolesData]
    );

    return (
      <>
        <tr>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>
            <Autocomplete
              multiple
              size="small"
              options={roleList}
              value={user.roles}
              onChange={handleRoleChange}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Roles" placeholder="Choose" />
              )}
            />
          </td>
          <td>
            <img
              height="50"
              width="50"
              alt="User Avatar"
              loading="lazy"
              src={userImage(user.image?.filePath)}
            />
          </td>
          <td>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </td>
          <td>
            <h5>UsersTableRow render count: {renderCount}</h5>
          </td>
        </tr>
        <DeleteUserModal
          showModal={showDeleteModal}
          closeModal={closeModal}
          userId={user.id}
        />
      </>
    );
  },
  (prevProps, nextProps) =>
    isEqual(prevProps.user, nextProps.user) &&
    isEqual(prevProps.roleList, nextProps.roleList)
);

export default UsersTableRow;
