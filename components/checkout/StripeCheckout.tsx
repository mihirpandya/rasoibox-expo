import { MODE, STRIPE_PUBLIC_KEY } from '@env';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { initiateIntent } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink } from '../../constants/Colors';
import * as Storage from "../common/Storage";
import StripeCheckoutForm from "./StripeCheckoutForm";


// const stripePromise = loadStripe("pk_live_51NKT9IDgBx8MbUKDEnyWUhYmtAwmdTxnAHNs5eAOsC9J0GTmHVdpQoeTF42EU3pG6rKGbYOZXUPVntxmB4UmWveM00daTVB6BO");
// const stripePromise = loadStripe("pk_test_51NKT9IDgBx8MbUKDtYV3RNaDYHlZS2DXYqvT7aoY10uxS7Nulza6XaVfw65P2Sqok2pyhlnyqCsEx5x6T1pKy7PQ00UdkwfT7J")
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
const appearance = {
    variables: {
        colorPrimary: rasoiBoxPink,
        fontFamily: 'Avenir',
    }
}

export default function StripeCheckout(props: { cartEmpty: boolean, firstName?: string, lastName?: string, promoCode?: string }) {
    const { cartEmpty, firstName, lastName, promoCode } = props;
    const [verificationCode, setVerificationCode] = useState<string>()
    const [orderId, setOrderId] = useState<string>();
    const [clientSecret, setClientSecret] = useState<string | undefined>()
    const options = {
        clientSecret: clientSecret,
        appearance: appearance
    };

    useEffect(() => {
        Storage.getAuthDetails().then(authDetails => {
            if (authDetails) {
                setVerificationCode(authDetails.verification_code)
            }
        })
    }, [])

    useEffect(() => {
        if (verificationCode) {
            initiateIntent(verificationCode).then(response => {
                setClientSecret(response["client_secret"])
                setOrderId(response["order_id"])
            })
        }
    }, [verificationCode])

    console.log(MODE)


    return (
        clientSecret && 
        orderId &&
        verificationCode &&
        <Elements stripe={stripePromise} options={options}>
            <StripeCheckoutForm cartEmpty={cartEmpty} orderId={orderId} verificationCode={verificationCode} firstName={firstName} lastName={lastName} promoCode={promoCode} />
        </Elements>
    )
}
