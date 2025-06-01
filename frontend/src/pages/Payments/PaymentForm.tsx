import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createPayment } from "../../utils/requests/payments";

/**
 * PaymentForm redirects user to LiqPay after payment data is received.
 */
const PaymentForm: React.FC = () => {
    const location = useLocation();
    const { amount: initAmount, description: initDescription } = (location.state || {}) as { amount?: number, description?: string };

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processPayment = async () => {
            if (!initAmount || !initDescription) {
                setError("Payment parameters are missing.");
                return;
            }
            try {
                const response = await createPayment(initAmount, initDescription);
                // Створюємо та відправляємо форму автоматично
                const form = document.createElement("form");
                form.method = "POST";
                form.action = response.liqpay_url || "https://www.liqpay.ua/api/3/checkout";
                form.acceptCharset = "utf-8";

                const inputData = document.createElement("input");
                inputData.type = "hidden";
                inputData.name = "data";
                inputData.value = response.data;
                form.appendChild(inputData);

                const inputSignature = document.createElement("input");
                inputSignature.type = "hidden";
                inputSignature.name = "signature";
                inputSignature.value = response.signature;
                form.appendChild(inputSignature);

                document.body.appendChild(form);
                form.submit();
            } catch (err) {
                setError("Payment request failed. Please try again.");
            }
        };

        processPayment();
    }, [initAmount, initDescription]);

    return (
        <div style={{ textAlign: "center", marginTop: 40 }}>
            {error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : (
                <div>Redirecting to LiqPay...</div>
            )}
        </div>
    );
};

export default PaymentForm;