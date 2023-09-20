import { Redirect } from 'expo-router';
import React from 'react';
import AuthShim from '../../components/common/AuthShim';
import OrderHistory from '../../components/orderHistory/OrderHistory';

export default function ViewOrderHistory() {
    
    return (
        <AuthShim authChild={<OrderHistory />} unauthChild={<Redirect href="/" />} />
    );
}