import React from "react";
import { useSelector } from "react-redux";
import { PageStatuses } from "../../store/state/reduserSlises/appSettingSlice";
import NotFoundPage from "../../components/NotFoundPage";

const ErrorPage = () => {
  const pageStatus = useSelector((state) => state.appSettings.pageStatus);

  switch (pageStatus) {
    case PageStatuses.NOT_FOUND:
      return <NotFoundPage />;
    case PageStatuses.BAD_REQUEST:
      return <NotFoundPage />;
    case PageStatuses.TOO_MANY_REQUESTS:
      return <NotFoundPage />;
    default:
      return null;
  }
};

export default ErrorPage;
