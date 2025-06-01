export interface Payment {
    liqpay_order_id: string;
    amount: number;
    description: string;
    status: 'pending' | 'success' | 'failed' | 'error';
    created_at: string; 
}
