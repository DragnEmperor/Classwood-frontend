import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import NotAuthorized from "../NotAuthorized";
import StartPay from "../School/StartPay";
import { selectAuth } from "../../store/auth";

export default function ProtectedRoute({ role, requirePaid = false, children }) {
  const location = useLocation();
  const { token, userType, isPaid } = useSelector(selectAuth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && userType !== role) {
    return <NotAuthorized />;
  }

  if (requirePaid && role === "School" && !isPaid) {
    return <StartPay />;
  }

  return children;
}
