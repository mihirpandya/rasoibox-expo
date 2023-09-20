import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/Themed';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import AuthShim from '../../components/common/AuthShim';
import { Redirect } from 'expo-router';
import OrderHistory from '../../components/orderHistory/OrderHistory';

export default function ViewOrderHistory() {
    
    return (
        <AuthShim authChild={<OrderHistory />} unauthChild={<Redirect href="/" />} />
    );
}