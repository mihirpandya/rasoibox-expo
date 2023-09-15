import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import CheckoutButton from '../common/CheckoutButton';
import ErrorText from '../common/ErrorText';

// https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements

interface OrderBackendApi {
    recipient_first_name: string,
    recipient_last_name: string,
    delivery_address: {
        user_input: string,
        street_name: string,
        street_number: number,
        apartment_number?: string,
        city: string,
        state: string,
        zipcode: string
    },
    phone_number: string,
    promo_codes: string[]
}

// {
//     "elementType": "address",
//     "elementMode": "shipping",
//     "value": {
//         "name": "Mihir Pandya",
//         "address": {
//             "line1": "945 Market Street",
//             "line2": "Apt 1",
//             "city": "San Francisco",
//             "country": "US",
//             "postal_code": "94103",
//             "state": "CA"
//         }
//     },
//     "empty": false,
//     "complete": true,
//     "isNewAddress": true
// }

interface StripeAddressEvent {
    elementType: string,
    elementMode: string,
    value: {
        name: string,
        address: {
            line1: string,
            line2: string,
            city: string,
            country: string,
            postal_code: string,
            state: string
        }
    },
    empty: boolean,
    complete: boolean,
    isNewAddress: boolean
}

export default function StripeCheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    
    const [error, setError] = useState<string>()

    function handleAddress(event: any) {
        const stripeEvent: StripeAddressEvent = event as StripeAddressEvent;
        console.log(stripeEvent.value.address)
    }

    async function submit() {
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return;
        }

        // initiate order in rasoibox-backend
        // confirm payment on stripe
        // set error if stripe returns error
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Shipping Information</Text>
            <PaymentElement />
            
            {/* https://stripe.com/docs/elements/address-element/collect-addresses?platform=web */}
            <AddressElement
                onChange={handleAddress}
                options={{mode: 'shipping'}}
            />
            
            <View style={{paddingTop: 30}}>
                {error && <ErrorText message={error}/>}
                <CheckoutButton active={true} onPress={submit}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingTop: 30,
        width: Dimensions.get('window').width < 700 ? '95%' : 380,
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : 0,
        marginTop: Dimensions.get('window').width < 700 ? 20 : 0,
        borderRadius: 10,
    },
        title: {
            fontFamily: 'CormorantGaramondSemiBold',
            fontSize: 35,
            paddingBottom: 30,
            paddingTop: 10
        },
});