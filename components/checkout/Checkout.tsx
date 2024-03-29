import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { allSiteWidePromos, emitEvent, getCart, isValidPopFestPromo, isValidPromoCode } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { WebsiteEvent } from '../../constants/EventTypes';
import { getEstimatedDelivery } from '../../constants/utils';
import { AuthDetails } from '../common/AuthShim';
import CartItem, { CartItemResponse } from '../common/CartItem';
import PriceInformation from '../common/PriceInformation';
import RemoveFromCartButton from '../common/RemoveFromCartButton';
import ResponseText from '../common/ResponseText';
import * as Storage from "../common/Storage";
import StripeCheckout from "./StripeCheckout";

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

export interface PromoCode {
    name: string,
    amountOff: number,
    percentOff: number
}

function getApplyStyle(active: boolean) {
    return active ? styles.applyActive : styles.applyInactive;
}

function totalAfterPromo(total: number, promoCode: PromoCode): number {
    if (promoCode.amountOff > 0) {
        return total - promoCode.amountOff;
    }

    return total - (promoCode.percentOff / 100) * total;
}

export default function Checkout() {
    document.title = "Checkout | Rasoi Box"
    const [authDetails, setAuthDetails] = useState<AuthDetails | undefined>(undefined);
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [error, setError] = useState<ErrorID>('no_error')
    const [cart, setCart] = useState<CartItemResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [priceLoading, setPriceLoading] = useState<boolean>(false);
    const [promoCode, setPromoCode] = useState<string>("")
    const [promoCodeError, setPromoCodeError] = useState<PromoCodeErrorId>('no_error');
    const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | undefined>(undefined)
    const [sitewidePromos, setSitewidePromos] = useState<PromoCode[]>([])
    const [subtotal, setSubtotal] = useState<number>(0)
    const [shipping, setShipping] = useState<number>(5)
    const [total, setTotal] = useState<number>(0)

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
        let total = 0;
        cart.forEach(cartItem => total += cartItem.price);
        setSubtotal(total);
        if (appliedPromoCode != undefined) {
            total = totalAfterPromo(total, appliedPromoCode)
        }
        sitewidePromos.forEach(promo => {
            total = totalAfterPromo(total, promo)
        })
        total = total + shipping
        setTotal(total);
    }, [cart, sitewidePromos, appliedPromoCode])


    useEffect(() => {
        fetchAuthDetails()
    }, [])

    useEffect(() => {
        fetchCart()
        if (authDetails?.verification_code) {
            emitEvent(WebsiteEvent.CHECKOUT, new Date(), authDetails.verification_code)
        }
    }, [authDetails])

    useEffect(() => {
        if (authDetails?.verification_code) {
            const promoCodes: string[] = appliedPromoCode ? [appliedPromoCode.name] : []
            setPriceLoading(true)
            allSiteWidePromos(authDetails.verification_code, promoCodes).then(response => {
                const promos: PromoCode[] = Object.values(response).map(item => {
                    return {
                        name: item['name'],
                        amountOff: item['amount_off'],
                        percentOff: item['percent_off']
                    }
                })

                setSitewidePromos(promos)
            }).finally(() => setPriceLoading(false))
        }
    }, [authDetails, cart, appliedPromoCode])

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

    function deleteAppliedPromoCode() {
        setAppliedPromoCode(undefined);
    }

    function applyPopFestPromoIfValid() {
        return isValidPopFestPromo(promoCode).then(response => {
            const status = response["status"]
            if (status == 0) {
                setAppliedPromoCode({
                    name: response["promo_code_name"],
                    amountOff: response["amount_off"],
                    percentOff: response["percent_off"]
                })
            } else if (status == 1) {
                setPromoCodeError('already_used')
            } else if (status == -1) {
                setPromoCodeError('expired')
            } else {
                setPromoCodeError('invalid')
            }
        }).catch(error => {
            console.error(error);
            setPromoCodeError('invalid')
        })
    }

    function submitPromoCode() {
        setPromoCodeError('no_error')
        setPriceLoading(true);
        if (appliedPromoCode != undefined) {
            setPromoCodeError('more_than_one')
            return;
        }

        AsyncStorage.getItem(Storage.ACCESS_TOKEN).then(token => {
            if (token == null) {
                throw Error()
            } else {
                isValidPromoCode(token, promoCode).then(response => {
                    const status = response["status"]
                    if (status == 0) {
                        setAppliedPromoCode({
                            name: response["promo_code_name"],
                            amountOff: response["amount_off"],
                            percentOff: response["percent_off"]
                        })
                    } else if (status == 1) {
                        setPromoCodeError('already_used')
                    } else if (status == -1) {
                        setPromoCodeError('expired')
                    } else {
                        throw Error()
                    }
                }).catch(_error => {
                    applyPopFestPromoIfValid()
                })
            }
        }).catch(_error => {
            applyPopFestPromoIfValid()
        }).finally(() => setPriceLoading(false))
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

    // const appliedPromoCodes: PromoCode[] = sitewidePromos
    // if (appliedPromoCode) {
    //     console.log(sitewidePromos)
    //     console.log(appliedPromoCode)
    //     appliedPromoCodes.push(appliedPromoCode)
    // }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView>
                <Header updateCart={true}/>
                <View style={styles.card}>
                    <StripeCheckout cartEmpty={cart.length == 0} firstName={authDetails?.first_name} lastName={authDetails?.last_name} email={authDetails?.email} promoCode={appliedPromoCode?.name}/>
                    <View style={styles.summary}>
                        <View style={{marginLeft: 20}}>
                            <Text style={styles.title}>Order Summary</Text>
                        </View>
                        {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{padding: 30}}/> :
                        <View style={{}}>
                            <FlatList 
                                data={cart}
                                renderItem={
                                    ({item}) => <CartItem cartItem={item}>
                                                    <RemoveFromCartButton 
                                                        verificationCode={authDetails?.verification_code}
                                                        recipeName={item.recipeName}
                                                        updateCartCallback={() => fetchCart()}
                                                    />
                                                </CartItem>
                                }/>
                            <Text style={styles.subtitle}>Estimated delivery: {getEstimatedDelivery()}</Text>
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
                            {promoCodeError != 'no_error' && <ResponseText message={PROMO_CODE_ERRORS[promoCodeError]}/>}
                            <PriceInformation
                                appliedPromoCode={appliedPromoCode}
                                sitewidePromos={sitewidePromos}
                                subtotal={subtotal}
                                shipping={shipping}
                                total={total}
                                showDelete={true}
                                showTaxes={false}
                                deleteAppliedPromoCode={deleteAppliedPromoCode}
                            />
                        </View>}
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column-reverse': 'row',
        justifyContent: 'space-evenly'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 30,
        paddingTop: 10
    },
    summary: {
        paddingTop: 30,
        width: Dimensions.get('window').width < 700 ? '95%' : 380,
        marginTop: 20,
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : 0,
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
        outlineStyle: 'none',
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
        paddingBottom: 20
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