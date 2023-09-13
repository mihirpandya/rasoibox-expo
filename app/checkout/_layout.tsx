import { Redirect } from 'expo-router';
import React from 'react';
import Checkout from '../../components/checkout/Checkout';
import AuthShim from '../../components/common/AuthShim';

export default function Menu() {
    return (
            <Checkout />
    )
}