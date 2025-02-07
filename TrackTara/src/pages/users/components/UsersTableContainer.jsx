import React, { useEffect } from "react";
import useActions from "../../../hooks/useActions";
import UsersTable from "./UsersTable";

const UsersTableContainer = () => {
  const { getUsers, getRolesData } = useActions();

  useEffect(() => {
    getUsers();
    getRolesData();
  }, []);

  return <UsersTable />;
};

export default UsersTableContainer;
