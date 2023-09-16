import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import CheckoutButton from '../common/CheckoutButton';
import ErrorText from '../common/ErrorText';
import { StripeAddressElementOptions } from '@stripe/stripe-js';
import { OrderBackendApi, initiatePlaceOrder } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink } from '../../constants/Colors';

// https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements

interface StripeAddressEvent {
    elementType: string,
    elementMode: string,
    value: {
        name: string,
        phone: string,
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

function getFirstAndLastName(fullName: string) {
    const nameArray: string[] = fullName.split(" ")
    return {
        firstName: nameArray[0],
        lastName: nameArray[nameArray.length - 1]
    }
}

export default function StripeCheckoutForm(props: {
    authToken?: string,
    firstName?: string,
    lastName?: string,
    promoCode?: string
}) {
    const { authToken, firstName, lastName, promoCode } = props;
    const stripe = useStripe();
    const elements = useElements();
    
    const [inputUserInfo, setInputUserInfo] = useState<StripeAddressEvent | undefined>();
    const [error, setError] = useState<string>();

    function getAddressElementOptions(): StripeAddressElementOptions {
        if (firstName && lastName) {
            return  {
                mode: 'shipping',
                allowedCountries: ['US'],
                fields: {
                    phone: 'always'
                },
                validation: {
                    phone: {
                        required: 'always',
                    },
                },
                defaultValues: {
                    name: firstName + " " + lastName
                }
            };
        } else {
            return {
                mode: 'shipping',
                allowedCountries: ['US'],
                fields: {
                    phone: 'always'
                },
                validation: {
                    phone: {
                        required: 'always',
                    },
                },
            };
        }
    }

    function handleAddress(event: any) {
        const stripeEvent: StripeAddressEvent = event as StripeAddressEvent;
        setInputUserInfo(stripeEvent);
    }

    async function submit() {
        setError(undefined);

        if (!authToken) {
            return;
        }

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return;
        }

        if (inputUserInfo == undefined || !inputUserInfo.complete) {
            console.log(inputUserInfo);
            setError("Please fill in your delivery details.");
            return;
        }

        const firstAndLastName = getFirstAndLastName(inputUserInfo.value.name)

        if (!firstName || !lastName) {
            setError("Please fill in your first and last name.");
            return;
        }

        const orderDetails: OrderBackendApi = {
            order_date: new Date(),
            recipient_first_name: firstAndLastName.firstName,
            recipient_last_name: firstAndLastName.lastName,
            phone_number: inputUserInfo.value.phone.substring(2),
            promo_codes: promoCode ? [promoCode] : [],
            delivery_address: {
                user_input: "",
                street_number: 0,
                street_name: inputUserInfo.value.address.line1,
                apartment_number: inputUserInfo.value.address.line2,
                city: inputUserInfo.value.address.city,
                state: inputUserInfo.value.address.state,
                zipcode: inputUserInfo.value.address.postal_code
            }

        }

        // initiate order in rasoibox-backend
        // confirm payment on stripe
        // set error if stripe returns error
        initiatePlaceOrder(authToken, orderDetails).then(response => {
            if (response["status"] == 0) {
                stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: 'https://www.rasoibox.com/'
                    }
                }).then(response => {
                    const { error } = response;
                    if (error) {
                        if (error.type == 'validation_error') {
                            setError("Invalid card information.")
                        } else if (error.type == 'card_error') {
                            setError("Card was declined. Please try a different card.")
                        } else {
                            setError("Payment did not succeed. Please try again.")
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    setError(error.message)
                })
            } else {
                setError("Failed to place order.")
            }
        }).catch(error => {
            setError("Failed to place order.")
        })
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Delivery & Payment</Text>
            {/* https://stripe.com/docs/elements/address-element/collect-addresses?platform=web */}
            <AddressElement
                onChange={handleAddress}
                options={getAddressElementOptions()}
            />

            <View style={{height: 10}}></View>

            <PaymentElement />
            
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