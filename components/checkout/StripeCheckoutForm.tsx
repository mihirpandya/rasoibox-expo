import { Ionicons } from '@expo/vector-icons';
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeAddressElementOptions } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OrderBackendApi, initiatePlaceOrder, isDeliverableZipcode } from '../../app/api/rasoibox-backend';
import { rasoiBoxGrey, rasoiBoxPink } from '../../constants/Colors';
import { validateEmail } from '../../validators/Validators';
import CheckoutButton, { CheckoutStatus } from '../common/CheckoutButton';
import ResponseText from '../common/ResponseText';

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
    cartEmpty: boolean,
    orderId: string,
    verificationCode: string,
    firstName?: string,
    lastName?: string,
    defaultEmail?: string,
    promoCode?: string,
}) {
    const { cartEmpty, orderId, verificationCode, firstName, lastName, defaultEmail, promoCode } = props;
    const stripe = useStripe();
    const elements = useElements();

    const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>(CheckoutStatus.checkout);
    const [inputUserInfo, setInputUserInfo] = useState<StripeAddressEvent | undefined>();
    const [email, setEmail] = useState<string | undefined>(defaultEmail);
    const [emailFocus, setEmailFocus] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    function getAddressElementOptions(): StripeAddressElementOptions {
        if (firstName && lastName) {
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
                defaultValues: {
                    name: firstName + " " + lastName
                }
            };
        } else {
            return {
                mode: 'shipping',
                allowedCountries: ['US'],
                fields: {
                    phone: 'always',
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

    function getEmailInputStyle() {
        return emailFocus ? styles.emailInputFocus : styles.emailInputBlur
    }

    async function submit() {
        setError(undefined);

        if (!verificationCode) {
            return;
        }

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return;
        }

        if (inputUserInfo == undefined || !inputUserInfo.complete) {
            setError("Please fill in your delivery details.");
            return;
        }

        const firstAndLastName = getFirstAndLastName(inputUserInfo.value.name)

        if (!firstAndLastName.firstName || !firstAndLastName.lastName) {
            setError("Please fill in your first and last name.");
            return;
        }

        if (!email || !validateEmail(email)) {
            setError("Please enter a valid email.")
            return;
        }

        const orderDetails: OrderBackendApi = {
            order_date: new Date(),
            recipient_first_name: firstAndLastName.firstName,
            recipient_last_name: firstAndLastName.lastName,
            email: email,
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

        // const deliverable: boolean = await isDeliverableZipcode(orderDetails.delivery_address.zipcode).then(response => {
        //     return response["status"] == 0
        // }).catch(error => {
        //     console.error(error);
        //     return false;
        // })

        // if (!deliverable) {
        //     setError("Rasoi Box only delivers to the greater San Francisco area. Please stay tuned as we work to expand our delivery zone!")
        //     return;
        // }

        // initiate order in rasoibox-backend
        // confirm payment on stripe
        // set error if stripe returns error
        setCheckoutStatus(CheckoutStatus.loading);
        initiatePlaceOrder(verificationCode, orderDetails).then(response => {
            if (response["status"] == 0) {
                stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: 'https://www.rasoibox.com/thankyou?order_id=' + orderId,
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
                        setCheckoutStatus(CheckoutStatus.checkout)
                    } else {
                        setCheckoutStatus(CheckoutStatus.success)
                    }
                }).catch(error => {
                    console.log(error);
                    setError(error.message)
                    setCheckoutStatus(CheckoutStatus.checkout)
                })
            } else {
                setError("Failed to place order.")
                setCheckoutStatus(CheckoutStatus.checkout)
            }
        }).catch(_error => {
            setError("Failed to place order.")
            setCheckoutStatus(CheckoutStatus.checkout)
        })
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Payment & Shipping</Text>
            {/* <View style={styles.shippingOptions}>
                <View style={styles.shippingOption}>
                    <Pressable style={{flexDirection: 'row'}}>
                        <Ionicons name="radio-button-on" size={20} color={rasoiBoxPink} />
                        <View style={styles.optionContainer}>
                            <Text style={styles.option}>Pick up</Text>
                            <Text style={styles.optionDescription}>
                                Rasoi Boxes will be available for pick up at Pop-Fest on Oct 15.
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.shippingOptionDisabled}>
                    <Ionicons name="radio-button-off" size={20} color='#808080' />
                    <View style={styles.optionContainer}>
                        <Text style={styles.option}>
                            Deliver to address
                        </Text>
                        <Text style={styles.optionDescription}>
                            {"Coming soon!\n\n\n"}
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={styles.title}>Payment Information</Text> */}
            {/* https://stripe.com/docs/elements/address-element/collect-addresses?platform=web */}
            <AddressElement
                onChange={handleAddress}
                options={getAddressElementOptions()}
            />

            {stripe && elements && <View style={styles.email}>
                <Text style={styles.emailText}>
                    Email
                </Text>
                <TextInput style={getEmailInputStyle()} placeholder='Email address' defaultValue={defaultEmail} onFocus={(e) => setEmailFocus(true)} onBlur={(e) => setEmailFocus(false)} onChangeText={setEmail} />
            </View>}

            <View style={{ height: 10 }} />

            <PaymentElement />

            <View style={{ paddingTop: 30 }}>
                {error && <ResponseText message={error} />}
                <CheckoutButton checkoutStatus={checkoutStatus} active={!cartEmpty} onPress={submit} />
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
    email: {
        paddingTop: 10,
        paddingBottom: 20
    },
    emailText: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
    },
    emailInputBlur: {
        borderWidth: 1,
        outlineStyle: 'none',
        fontSize: 16,
        padding: 12,
        borderRadius: 5,
        borderColor: 'rgb(230, 230, 230)',
        shadowRadius: 1,
        shadowColor: 'rgb(230, 230, 230)',
        fontFamily: 'AvenirLight',
    },
    emailInputFocus: {
        borderWidth: 3,
        outlineStyle: 'none',
        fontSize: 16,
        padding: 12,
        borderRadius: 5,
        borderColor: 'rgba(241, 122, 126, 0.4)',
        fontFamily: 'AvenirLight',
    },
    shippingOptions: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column': 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    shippingOption: {
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        shadowRadius: 1,
        shadowColor: rasoiBoxGrey,
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
    },
    shippingOptionDisabled: {
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
    },
    optionContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 5
    },
    option: {
        fontFamily: 'AvenirLight',
        fontWeight: 'bold',
        fontSize: 14
    },
    optionDescription: {
        fontSize: 10,
        color: '#808080'
    }
});