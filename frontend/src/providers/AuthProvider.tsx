import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import PageLayout from "@/components/layout/PageLayout";


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const isLoading = useAuthStore((state) => state.isLoading)
    const fetchUser = useAuthStore((state) => state.fetchUser);

    useEffect(() => {
        fetchUser()
    }, []);

    if (isLoading) {
        return (
            <PageLayout>
                <div className="container-custom py-20 text-center flex flex-col items-center">
                    <div className="mb-4">
                        <span className="inline-block w-12 h-12 border-4 border-lider-red border-t-transparent rounded-full animate-spin"></span>
                    </div>
                    <h2 className="text-xl">Завантаження...</h2>
                </div>
            </PageLayout>
        )
    }

    return <>{children}</>;
};

export default AuthProvider;