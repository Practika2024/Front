import React from "react";
import { useSelector } from "react-redux";
import UserProfileForm from "./components/UserProfileForm";
import RoleAvatarMark from "../../components/common/RoleAvatarMark";

const MyProfilePage = () => {
  const id = useSelector((store) => store.user.currentUser?.id);
  const roles = useSelector((store) => store.user.currentUser?.role);
  const name = useSelector((store) => store.user.currentUser?.name);
  const email = useSelector((store) => store.user.currentUser?.email);
  return (
    <>
      {id && name && email && (
        <div className="d-flex gap-4 my-3 justify-content-between align-items-start container flex-wrap">
          <div className="d-flex flex-column align-items-center gap-2">
            <RoleAvatarMark roles={roles} sizePx={72} showLabel />
          </div>
          <UserProfileForm id={id} name={name} email={email} />
        </div>
      )}
    </>
  );
};

export default MyProfilePage;
