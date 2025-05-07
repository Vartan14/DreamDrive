import { useEffect, useState} from "react";
import { setUser } from "../utils/auth";


const MainWrapper = ({ children }) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                await setUser();
            } catch (error) {
                console.error("Failed to initialize user:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return <>{children}</>;

};

export default MainWrapper;