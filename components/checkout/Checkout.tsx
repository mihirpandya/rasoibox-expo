import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getCart, updateCart } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import CartItem, { CartItemResponse } from '../common/CartItem';
import CheckoutButton from '../common/CheckoutButton';
import ErrorText from '../common/ErrorText';
import FormKey from '../common/FormKey';
import FormValue from '../common/FormValue';
import * as Storage from "../common/Storage";

export const errorIds = [
    'no_error',
    'first_name',
    'last_name',
    'address',
    'out_of_delivery',
    'phone_number'
] as const;

type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    first_name: "Please enter your first name.",
    last_name: "Please enter your last name.",
    address: "Please enter your address.",
    out_of_delivery: "This address is not in our delivery zone.",
    phone_number: "Please enter a 10-digit phone number."
}

export const promoCodeErrIds = [
    'no_error',
    'invalid',
    'expired',
    'already_used',
    'more_than_one'
]

type PromoCodeErrorId = typeof promoCodeErrIds[number];

const PROMO_CODE_ERRORS: Record<PromoCodeErrorId, string> = {
    no_error: "There is no error. No message to show.",
    invalid: "Invalid promo code.",
    expired: "This promo code has expired.",
    already_used: "This promo code has already been used.",
    more_than_one: "Only one promo code can be applied per order."
}

function getApplyStyle(active: boolean) {
    return active ? styles.applyActive : styles.applyInactive;
}

export default function Checkout() {
    const [authDetails, setAuthDetails] = useState<AuthDetails | undefined>(undefined);
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [error, setError] = useState<ErrorID>('no_error')
    const [cart, setCart] = useState<CartItemResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [promoCode, setPromoCode] = useState<string>("")
    const [promoCodeError, setPromoCodeError] = useState<PromoCodeErrorId>('no_error');
    const [appliedPromoCode, setAppliedPromoCode] = useState<string | undefined>(undefined)

    const fetchAuthDetails = () => {
        Storage.getAuthDetails().then(details => {
            if (details != null) {
                setAuthDetails(details)
            }
        }).catch(error => {
            console.error(error);
        })
    }

    function fetchCart() {
        if (authDetails?.verification_code != undefined) {
            setLoading(true);
            getCart(authDetails.verification_code).then(response => {
                const cartItems: CartItemResponse[] = Object.values(response).map(item => {
                    return {
                        recipeName: item["recipe_name"],
                        imageUrl: item["image_url"],
                        servingSize: item["serving_size"],
                        price: item["price"]
                    }
                });

                setCart(cartItems);
                setLoading(false);
            })
        }
    }

    useEffect(() => {
        fetchAuthDetails()
    }, [])

    useEffect(() => {
        fetchCart()
    }, [authDetails])

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    function submitPromoCodeIfEnter(event: any) {
        if (event.key === "Enter") {
            submitPromoCode();
        }
    }

    function deleteItem(recipeName: string) {
        if (authDetails?.verification_code != undefined) {
            updateCart(authDetails.verification_code, recipeName, 0).then(_response => fetchCart())
        }
    }

    function submitPromoCode() {
        console.log("submit promo code")
    }

    function submit() {
        setError('no_error');

        if (firstName.length <= 1) {
            setError('first_name');
            return;
        }

        if (lastName.length <= 1) {
            setError('last_name');
            return;
        }

        if (address.length <= 5) {
            setError('address');
            return;
        }

        if (phoneNumber.length != 10) {
            setError('phone_number');
            return;
        }
    }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView>
                <Header />
                <View style={styles.card}>
                    <View style={styles.collectInfo}>
                        <Text style={styles.title}>Shipping Information</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
                            <View style={{width: '45%'}}>
                                <FormKey>First Name</FormKey>
                                <FormValue onChangeText={setFirstName} onKeyPress={submitIfEnter} defaultValue={authDetails?.first_name}></FormValue>
                            </View>
                            <View style={{width: '45%'}}>
                                <FormKey>Last Name</FormKey>
                                <FormValue onChangeText={setLastName} onKeyPress={submitIfEnter} defaultValue={authDetails?.last_name}></FormValue>
                            </View>
                        </View>
                        <View style={{paddingTop: 20}}>
                            <FormKey>Shipping Address</FormKey>
                            <FormValue onChangeText={setAddress} onKeyPress={submitIfEnter}></FormValue>
                        </View>
                        <View style={{paddingTop: 20}}>
                            <FormKey>Phone Number</FormKey>
                            <FormValue onChangeText={setPhoneNumber} onKeyPress={submitIfEnter}></FormValue>
                        </View>
                    </View>
                    <View style={styles.summary}>
                        <View style={{marginLeft: 20}}>
                            <Text style={styles.title}>Order Summary</Text>
                        </View>
                        <FlatList 
                            data={cart}
                            renderItem={
                                ({item}) => <CartItem cartItem={item} deleteItem={() => deleteItem(item.recipeName)}/>
                            }/>
                        <Text style={styles.subtitle}>Estimated Delivery August 20, 2023</Text>
                        <View style={styles.promocode}>
                            <Ionicons style={{marginRight: -30}} name="pricetags" size={20} color={rasoiBoxPink} />
                            <TextInput style={styles.promocodeText} placeholder='Promo code' onChangeText={setPromoCode} onKeyPress={submitPromoCodeIfEnter}/>
                            <View style={getApplyStyle(promoCode.length > 0)}>
                                <Pressable onPress={submitPromoCode}>
                                    <Text style={styles.applyText}>
                                        Apply
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                        {promoCodeError != 'no_error' && <ErrorText message={PROMO_CODE_ERRORS[promoCodeError]}/>}
                        <View style={styles.subtotal}>
                            <View style={styles.section}>
                                <Text style={styles.key}>Subtotal</Text>
                                <Text style={styles.value}>$20.00</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.key}>Shipping</Text>
                                <Text style={styles.value}>Free</Text>
                            </View>
                            {
                                appliedPromoCode != undefined &&
                                <View style={styles.section}>
                                    <Text style={styles.key}>Promo code</Text>
                                    <Text style={styles.value}>{appliedPromoCode}</Text>
                                </View>
                            }
                            <View style={styles.section}>
                                <Text style={styles.key}>Taxes</Text>
                                <Text style={styles.value}>Calculated at next step</Text>
                            </View>
                        </View>
                        <View style={styles.total}>
                            <View style={styles.section}>
                                <Text style={styles.key}>Total</Text>
                                <Text style={styles.value}>$20.00</Text>
                            </View>
                        </View>
                        <View>
                            {error != 'no_error' && <ErrorText message={ERRORS[error]}/>}
                            <CheckoutButton active={true} onPress={submit}/>
                        </View>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column': 'row',
        justifyContent: 'space-evenly'
    },
    collectInfo: {
        paddingTop: 30,
        width: Dimensions.get('window').width < 700 ? '95%' : 500,
        marginLeft: Dimensions.get('window').width < 700 ? 0 : '5%',
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 30,
        // textAlign: 'center',
        paddingTop: 10
    },
    summary: {
        paddingTop: 30,
        width: Dimensions.get('window').width < 700 ? '95%' : 380,
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : 0,
        marginTop: Dimensions.get('window').width < 700 ? 20 : 0,
        borderRadius: 10,
        borderWidth: 1
    },
    subtitle: {
        textAlign: 'center',
        padding: 5,
        fontFamily: 'AvenirLight',
        color: '#808080'
    },
    promocode: {
        borderTopWidth: 1,
        borderColor: '#808080',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
    },
    promocodeText: {
        fontFamily: 'AvenirLight',
        fontStyle: 'italic',
        width: '60%',
        backgroundColor: 'white',
        color: rasoiBoxGrey,
        height: 40,
        paddingLeft: 33,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: rasoiBoxYellow
    },
    applyText: {
        fontFamily: 'AvenirLight',
        color: 'white',
    },
    applyActive: {
        backgroundColor: rasoiBoxYellow,
        borderRadius: 20,
        paddingLeft: 30,
        paddingRight: 30,
        marginLeft: -40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    applyInactive: {
        backgroundColor: '#aaaaaa',
        borderRadius: 20,
        paddingLeft: 30,
        paddingRight: 30,
        marginLeft: -40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    subtotal: {
        borderTopWidth: 1,
        borderColor: '#808080',
        marginLeft: 20,
        marginRight: 20,
    },
    total: {
        borderTopWidth: 1,
        borderColor: '#808080',
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 30
    },
    section: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'space-between'
    },
    key: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
    },
    value: {
        fontFamily: 'AvenirLight',
        fontSize: 15
    }
});