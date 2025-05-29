import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../../utils/payments";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const PaymentResult: React.FC = () => {
    const [status, setStatus] = useState<"pending" | "success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fetchUser = useAuthStore((state) => state.fetchUser);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const result = await getPaymentStatus();
                if (result.status === "success") {
                    setStatus("success");
                    setMessage("Оплата успішна! Дякуємо за покупку.");
                    // Оновлюємо authStore перед переходом
                    await fetchUser();
                } else if (result.status === "pending") {
                    setStatus("pending");
                    setMessage("Оплата обробляється. Будь ласка, зачекайте...");
                } else {
                    setStatus("error");
                    setMessage("Оплата не вдалася або була скасована.");
                }
            } catch (e) {
                setStatus("error");
                setMessage("Сталася помилка при перевірці статусу оплати.");
            } finally {
                setTimeout(() => navigate("/dashboard"), 2500);
            }
        };

        checkStatus();
    }, [navigate, searchParams, fetchUser]);

    return (
        <PageLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Card className="bg-secondary border-gray-800 w-full max-w-md">
                    <CardContent className="py-10 flex flex-col items-center">
                        {status === "success" && (
                            <>
                                <CheckCircle size={48} className="text-green-500 mb-4" />
                                <div className="text-green-500 text-xl font-bold mb-2">{message}</div>
                            </>
                        )}
                        {status === "pending" && (
                            <>
                                <Loader2 size={48} className="text-yellow-500 mb-4 animate-spin" />
                                <div className="text-yellow-500 text-xl font-bold mb-2">{message}</div>
                            </>
                        )}
                        {status === "error" && (
                            <>
                                <XCircle size={48} className="text-red-500 mb-4" />
                                <div className="text-red-500 text-xl font-bold mb-2">{message}</div>
                            </>
                        )}
                        {!status && (
                            <>
                                <Loader2 size={48} className="text-gray-300 mb-4 animate-spin" />
                                <div className="text-gray-300 text-xl font-bold mb-2">Перевіряємо статус оплати...</div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
};

export default PaymentResult;