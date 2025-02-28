import React, { useCallback, useState, useMemo } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import userImage from "../../../hooks/userImage";
import DeleteUserModal from "./usersModals/DeleteUserModal";
import { useRenderCount } from "../../../hooks/useRenderCount";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import PropTypes from 'prop-types';

const UsersTableRow = React.memo(
    ({ user, roleList }) => {
        const [showDeleteModal, setShowDeleteModal] = useState(false);
        const { changeRoles, getUsers } = useActions();
        const renderCount = useRenderCount();
        const [selectedRole, setSelectedRole] = useState(user.role || '');

        const closeModal = useCallback(() => {
            setShowDeleteModal(false);
        }, []);

        const handleRoleChange = useCallback(
            async (event) => {
                const newRole = event.target.value;
                if (newRole === selectedRole) return;

                try {
                    const result = await changeRoles(user.id, newRole);

                    if (result.success) {
                        await getUsers();
                        setSelectedRole(newRole);
                        toast.success("User role updated successfully.");
                    } else {
                        toast.error(result.message || "Failed to update role.");
                    }
                } catch (error) {
                    toast.error("Failed to change roles.");
                }
            },
            [user.id, selectedRole, changeRoles, getUsers]
        );

        const userAvatar = useMemo(() => userImage(user.image?.filePath), [user.image]);
        const roleOptions = useMemo(() => roleList.length ? roleList : [{ name: "No Roles Available" }], [roleList]);

        return (
            <>
                <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <Select
                            value={selectedRole}
                            onChange={handleRoleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Role' }}
                        >
                            {roleOptions.map((role) => (
                                <MenuItem key={role.name} value={role.name} disabled={role.name === "No Roles Available"}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </td>
                    <td>
                        <img
                            height="50"
                            width="50"
                            alt="User Avatar"
                            loading="lazy"
                            src={userAvatar}
                        />
                    </td>
                    <td>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Delete
                        </Button>
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

UsersTableRow.displayName = 'UsersTableRow';

UsersTableRow.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired
            })
        ),
        image: PropTypes.shape({
            filePath: PropTypes.string
        })
    }).isRequired,
    roleList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired
    })).isRequired
};

export default UsersTableRow;