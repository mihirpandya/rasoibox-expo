import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCart, updateCart } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import CartItem, { CartItemResponse } from "../common/CartItem";
import CheckoutButton from "../common/CheckoutButton";
import * as Storage from "../common/Storage";

export default function RightCart(props: {closeLightbox: () => void}) {
    const [authDetails, setAuthDetails] = useState<AuthDetails>();
    const [cart, setCart] = useState<CartItemResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true);

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
        Storage.getAuthDetails().then(stored => {
            if (stored == undefined) {
                stored = {
                    authenticated: false
                }
            }
            setAuthDetails(stored);
        })
    }, [])

    useEffect(() => {
        fetchCart()
    }, [authDetails])

    function deleteItem(recipeName: string) {
        if (authDetails?.verification_code != undefined) {
            updateCart(authDetails.verification_code, recipeName, 0).then(_response => fetchCart())
        }
    }

    function checkout() {
        router.replace("/checkout");
        props.closeLightbox();
    }

    if (loading) {
        return (<ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/>);
    } else {
        return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        <Text style={styles.title}>Your Cart</Text>
                        <FlatList 
                            data={cart}
                            renderItem={
                                ({item}) => <CartItem cartItem={item} deleteItem={() => deleteItem(item.recipeName)}/>
                            }/>
                        <Text style={styles.subtitle}>All orders placed after Thursday will arrive on the following Sunday.</Text>
                    </ScrollView>
                    <CheckoutButton loading={false} active={cart.length > 0} onPress={checkout}/>
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
        color: '#808080'
    }
});