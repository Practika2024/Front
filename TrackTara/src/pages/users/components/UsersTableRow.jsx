import React, { useCallback, useState, useMemo } from "react";
import { Select, MenuItem } from "@mui/material";
import DeleteUserModal from "./usersModals/DeleteUserModal";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import PropTypes from 'prop-types';

const UsersTableRow = React.memo(
    ({ user, roleList }) => {
        const [showDeleteModal, setShowDeleteModal] = useState(false);
        const { changeRoles, getUsers } = useActions();
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
                        toast.success("Роль користувача успішно оновлено");
                    } else {
                        toast.error(result.message || "Не вдалося оновити роль");
                    }
                } catch (error) {
                    toast.error("Не вдалося змінити роль");
                }
            },
            [user.id, selectedRole, changeRoles, getUsers]
        );

        const roleOptions = useMemo(() => roleList.length ? roleList : [{ name: "Немає доступних ролей" }], [roleList]);

        return (
            <>
                <tr>
                    <td className="text-center">{user.name}</td>
                    <td className="text-center">{user.email}</td>
                    <td className="text-center">
                        <Select
                            value={selectedRole}
                            onChange={handleRoleChange}
                            displayEmpty
                            size="small"
                            sx={{
                                minWidth: 150,
                                '& .MuiSelect-select': {
                                    py: 1,
                                    fontSize: '14px'
                                }
                            }}
                        >
                            {roleOptions.map((role) => (
                                <MenuItem key={role.name} value={role.name} disabled={role.name === "Немає доступних ролей"}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </td>
                    <td className="text-center">
                        <button
                            className="table-action-btn"
                            title="Видалити користувача"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <img
                                src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                alt="Delete"
                            />
                        </button>
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
        )
    }).isRequired,
    roleList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired
    })).isRequired
};

export default UsersTableRow;