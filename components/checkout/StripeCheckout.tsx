import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState, useEffect } from 'react';
import StripeCheckoutForm from "./StripeCheckoutForm";
import * as Storage from "../common/Storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initiateIntent } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink } from '../../constants/Colors';

process.env.STRIPE_PUB_KEY

const stripePromise = loadStripe("pk_test_51NKT9IDgBx8MbUKDtYV3RNaDYHlZS2DXYqvT7aoY10uxS7Nulza6XaVfw65P2Sqok2pyhlnyqCsEx5x6T1pKy7PQ00UdkwfT7J");
const appearance = {
    variables: {
        colorPrimary: rasoiBoxPink
    }
}

export default function StripeCheckout() {
    const [orderId, setOrderId] = useState<string | undefined>();
    const [clientSecret, setClientSecret] = useState<string | undefined>("pi_3NqiD3DgBx8MbUKD0i84uaOa_secret_tXv7hWUnRs5hGEmebzw8oLjga")
    const options = {
        clientSecret: clientSecret,
        appearance: appearance
    };

    const [authtoken, setAuthToken] = useState<string | undefined>()

    function fetchToken() {
        AsyncStorage.getItem(Storage.ACCESS_TOKEN).then(async token => {
            if (token != null) {
                setAuthToken(token);
            }
        }).catch(error => {
            console.error(error);
            
        });
    }

    useEffect(() => {
        fetchToken()
      }, [])

    useEffect(() => {
        if (authtoken) {
            initiateIntent(authtoken).then(response => {
                setClientSecret(response["client_secret"])
                setOrderId(response["order_id"])
            })
        }
    }, [authtoken])

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripeCheckoutForm />
        </Elements>
    )
}
