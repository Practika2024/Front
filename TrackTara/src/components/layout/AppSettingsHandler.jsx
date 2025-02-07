import React, { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../common/loader/Loader";
import { PageStatuses } from "../../store/state/reduserSlises/appSettingSlice";

const AppSettingsHandler = memo(() => {
  const apiRequestIsLoading = useSelector(
    (state) => state.appSettings.apiRequestIsLoading
  );
  const pageStatus = useSelector((state) => state.appSettings.pageStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (pageStatus !== PageStatuses.GOOD) {
      navigate("/error", { replace: true });
    }
  }, [pageStatus]);

  return apiRequestIsLoading ? <Loader /> : null;
});

export default AppSettingsHandler;
