import { PAYMENT_URL, PAYMENT_STATUS_URL } from "./constant";
import apiInstance from "./axios";

/**
 * Sends a POST request to the backend to create a payment.
 * @param amount The payment amount
 * @param description The payment description
 * @returns Promise with the backend response
 */
export async function createPayment(amount: number, description: string) {
    try {
        const response = await apiInstance.post(PAYMENT_URL, {
            amount,
            description,
        });

        return response.data;
    } catch (error: any) {
        console.error('Error while creating payment:', error);
        throw error;
    }
}

/**
 * Sends a GET request to the backend to get payment status.
 *  The ID of the payment to check status
 * @returns Promise with the backend response
 */
export async function getPaymentStatus() {
    try {
        const response = await apiInstance.get(`${PAYMENT_STATUS_URL}`);
        return response.data;
    } catch (error: any) {
        console.error('Error while getting payment status:', error);
        throw error;
    }
}