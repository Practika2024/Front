import React from "react";
import { useSelector } from "react-redux";
import UserProfileForm from "./components/UserProfileForm";

const MyProfilePage = () => {
  const id = useSelector((store) => store.user.currentUser?.id);
  const image = useSelector((store) => store.user.currentUser?.image);
  const name = useSelector((store) => store.user.currentUser?.name);
  const email = useSelector((store) => store.user.currentUser?.email);
  return (
    <>
      {id && image && name && email && (
        <div className="d-flex gap-3 my-3 justify-content-between align-items-center container">
          <UserImage userId={id} image={image} />
          <UserProfileForm id={id} name={name} email={email} />
        </div>
      )}
    </>
  );
};

export default MyProfilePage;
