import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth, selectAuth, setAuth } from "../store/auth";
import { clearStoredToken } from "../api/client";

export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);

  const login = (payload) => dispatch(setAuth(payload));

  const logout = ({ redirect = "/" } = {}) => {
    dispatch(clearAuth());
    clearStoredToken();
    navigate(redirect);
  };

  return {
    ...auth,
    isAuthenticated: !!auth.token,
    login,
    logout,
  };
}
