import React, { useCallback, useState, useMemo } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import RoleAvatarMark from "../../../components/common/RoleAvatarMark";
import DeleteUserModal from "./usersModals/DeleteUserModal";
import AdminResetPasswordModal from "./usersModals/AdminResetPasswordModal";
import { useRenderCount } from "../../../hooks/useRenderCount";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import PropTypes from 'prop-types';

const UsersTableRow = React.memo(
    ({ user, roleList }) => {
        const [showDeleteModal, setShowDeleteModal] = useState(false);
        const [showPasswordModal, setShowPasswordModal] = useState(false);
        const { changeRoles, getUsers } = useActions();
        const renderCount = useRenderCount();
        const [selectedRole, setSelectedRole] = useState(
            Array.isArray(user.role) ? (user.role[0] ?? "") : (user.role || ""),
        );

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
                        toast.success("Роль користувача успішно оновлено.");
                    } else {
                        toast.error(result.message || "Не вдалося оновити роль.");
                    }
                } catch (error) {
                    toast.error("Не вдалося змінити ролі.");
                }
            },
            [user.id, selectedRole, changeRoles, getUsers]
        );

        const roleOptions = useMemo(() => roleList.length ? roleList : [{ name: "Ролі відсутні" }], [roleList]);

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
                            inputProps={{ 'aria-label': 'Роль' }}
                        >
                            {roleOptions.map((role) => (
                                <MenuItem key={role.name} value={role.name} disabled={role.name === "Ролі відсутні"}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </td>
                    <td>
                        <RoleAvatarMark user={user} sizePx={50} />
                    </td>
                    <td>
                        <div className="d-flex flex-wrap gap-2">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setShowPasswordModal(true)}
                            >
                                Пароль
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Видалити
                            </Button>
                        </div>
                    </td>
                </tr>
                <AdminResetPasswordModal
                    show={showPasswordModal}
                    onHide={() => setShowPasswordModal(false)}
                    userId={user.id}
                    userEmail={user.email}
                />
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
        role: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
        roles: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired
            })
        ),
    }).isRequired,
    roleList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired
    })).isRequired
};

export default UsersTableRow;