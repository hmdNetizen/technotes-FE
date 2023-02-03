import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  if (token) {
    const decoded = jwt_decode(token);

    const { username, roles } = decoded.UserInfo;

    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isAdmin) status = "Admin";
    if (isManager) status = "Manager";

    return { status, isAdmin, isManager, roles, username };
  }
  return { status, isAdmin, isManager, roles: [], username: "" };
};

export default useAuth;
