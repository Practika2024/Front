import NoImageUser from "../assets/images/noImgUser.png";

const userImage = (userImage) => {
  if (userImage !== undefined)
    return userImage === "N/A"
      ? NoImageUser
      : `http://13.60.245.135:4312/Images/userImages/${userImage}`;
  else return NoImageUser;
};

export default userImage;
