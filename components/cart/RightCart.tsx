import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCart, updateCart } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import CartItem, { CartItemResponse } from "../common/CartItem";
import CheckoutButton, { CheckoutStatus } from "../common/CheckoutButton";
import * as Storage from "../common/Storage";
import TextLink from '../common/TextLink';
import RemoveFromCartButton from '../common/RemoveFromCartButton';

export default function RightCart(props: {
    loading: boolean,
    cart: CartItemResponse[],
    closeLightbox: () => void,
    fetchCart:() => void
}) {
    const [authDetails, setAuthDetails] = useState<AuthDetails>();

    const { loading, cart, closeLightbox, fetchCart } = props

    useEffect(() => {
        Storage.getAuthDetails().then(stored => {
            if (stored == undefined) {
                stored = {
                    authenticated: false
                }
            }
            setAuthDetails(stored);
        })
    }, [])

    function checkout() {
        window.open("/checkout", "_self");
        closeLightbox();
    }

    if (loading) {
        return (<ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}} />);
    } else {
        return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        <Text style={styles.title}>Your Cart</Text>
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
                        <Text style={styles.subtitle}>All orders placed before Thursday, Oct 12 can be picked up at <TextLink link="https://www.eventbrite.com/e/popfest-2023-tickets-685848420087?aff=rasoibox" text="Pop-Fest" /> on Oct 15.</Text>
                    </ScrollView>
                    <CheckoutButton checkoutStatus={CheckoutStatus.checkout} active={cart.length > 0} onPress={checkout}/>
                    <Text style={styles.subtitle}>All promo codes will be applied at checkout.</Text>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    title: {
        padding: 20,
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 25
    },
    subtitle: {
        textAlign: 'center',
        padding: 5,
        fontFamily: 'AvenirLight',
        color: '#808080',
        paddingBottom: 20,
    },
});