import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddressElement, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import * as Storage from "../../components/common/Storage";

const stripePromise = loadStripe("pk_test_51NKT9IDgBx8MbUKDtYV3RNaDYHlZS2DXYqvT7aoY10uxS7Nulza6XaVfw65P2Sqok2pyhlnyqCsEx5x6T1pKy7PQ00UdkwfT7J");

export default function StripePage() {
    const [clientSecret, setClientSecret] = useState<string | undefined>("pi_3NqiD3DgBx8MbUKD0i84uaOa_secret_tXv7hWUnRs5hGEmebzw8oLjga")
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

    const options = {
        // passing the client secret obtained from the server
        clientSecret: clientSecret,
      };
    
    return (
        <View>
            <Header />

            {clientSecret && <Elements stripe={stripePromise} options={options}>
                <PaymentElement />
                <AddressElement options={{mode: 'shipping'}}/>
            </Elements>}

            <Footer />
        </View>
    );
}