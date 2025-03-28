import React from "react";

const MyNotification = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return <p className="notification">{errorMessage}</p>;
};

export default MyNotification;
