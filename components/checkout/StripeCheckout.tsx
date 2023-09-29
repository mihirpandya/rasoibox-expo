import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState, useEffect } from 'react';
import StripeCheckoutForm from "./StripeCheckoutForm";
import * as Storage from "../common/Storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initiateIntent } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink } from '../../constants/Colors';

process.env.STRIPE_PUB_KEY

const stripePromise = loadStripe("pk_live_51NKT9IDgBx8MbUKDEnyWUhYmtAwmdTxnAHNs5eAOsC9J0GTmHVdpQoeTF42EU3pG6rKGbYOZXUPVntxmB4UmWveM00daTVB6BO");
const appearance = {
    variables: {
        colorPrimary: rasoiBoxPink,
        fontFamily: 'Avenir',
    }
}

export default function StripeCheckout(props: {cartEmpty: boolean, firstName?: string, lastName?: string, promoCode?: string}) {
    const { cartEmpty, firstName, lastName, promoCode } = props;
    const [orderId, setOrderId] = useState<string>();
    const [clientSecret, setClientSecret] = useState<string | undefined>()
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
        clientSecret && orderId &&
        <Elements stripe={stripePromise} options={options}>
            <StripeCheckoutForm cartEmpty={cartEmpty} orderId={orderId} authToken={authtoken} firstName={firstName} lastName={lastName} promoCode={promoCode} />
        </Elements>
    )
}
