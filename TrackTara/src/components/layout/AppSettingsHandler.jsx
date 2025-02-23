import React, { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../common/loader/Loader";

const AppSettingsHandler = memo(() => {
  const apiRequestIsLoading = useSelector(
    (state) => state.appSettings.apiRequestIsLoading
  );
  return apiRequestIsLoading ? <Loader /> : null;
});

export default AppSettingsHandler;
