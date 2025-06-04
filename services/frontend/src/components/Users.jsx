import { useUser } from "../context/UserContext";

const { token } = useUser();
useEffect(() => {
  getAllUsers(token).then(...);
}, [token]);