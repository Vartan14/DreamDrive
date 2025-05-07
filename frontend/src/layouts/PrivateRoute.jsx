import {Navigate} from "react-router-dom";
import {useAuthStore} from "../store/auth.js";


const PrivateRoute = ({ children }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;    