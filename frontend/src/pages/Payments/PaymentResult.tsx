import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { getPaymentStatus } from "@/utils/requests/payments";

const PaymentResult: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"success" | "pending" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const result = await getPaymentStatus();
                if (result.status === "success") {
                    setStatus("success");
                    setMessage("Оплата успішна!");
                } else if (result.status === "pending") {
                    setStatus("pending");
                    setMessage("Оплата очікує підтвердження.");
                } else {
                    setStatus("error");
                    setMessage("Оплата не вдалася або була скасована.");
                }
            } catch (e) {
                setStatus("error");
                setMessage("Сталася помилка при перевірці статусу оплати.");
            }
        };

        checkStatus();
    }, [navigate, searchParams]);

    const handleOk = () => {
        navigate("/dashboard");
    };

    return (
        <PageLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Card className="bg-secondary border-gray-800 w-full max-w-md">
                    <CardContent className="py-10 flex flex-col items-center">
                        {status === null ? (
                            <>
                                <Loader2 size={48} className="text-gray-300 mb-4 animate-spin" />
                                <div className="text-gray-300 text-xl font-bold mb-2">Перевіряємо статус оплати...</div>
                            </>
                        ) : status === "success" ? (
                            <>
                                <CheckCircle size={48} className="text-green-500 mb-4" />
                                <div className="text-green-500 text-xl font-bold mb-2">{message}</div>
                                <Button className="mt-6" onClick={handleOk}>Ок</Button>
                            </>
                        ) : status === "pending" ? (
                            <>
                                <Loader2 size={48} className="text-yellow-500 mb-4 animate-spin" />
                                <div className="text-yellow-500 text-xl font-bold mb-2">{message}</div>
                                <Button className="mt-6" onClick={handleOk}>Ок</Button>
                            </>
                        ) : (
                            <>
                                <XCircle size={48} className="text-red-500 mb-4" />
                                <div className="text-red-500 text-xl font-bold mb-2">{message}</div>
                                <Button className="mt-6" onClick={handleOk}>Ок</Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
};

export default PaymentResult;