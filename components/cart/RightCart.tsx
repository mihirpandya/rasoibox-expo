import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCart, updateCart } from '../../app/api/rasoibox-backend';
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";
import { router } from 'expo-router';

interface CartItemResponse {
    recipeName: string,
    imageUrl: string,
    servingSize: number,
    price: number
}

function ellipsify(name: string): string {
    return name.substring(0, 15) + "..."
}

function checkoutButtonStyle(cartEmpty: boolean)  {
    return cartEmpty ? styles.inactiveCheckoutButton : styles.checkoutButton
}

function CartItem(props: { cartItem: CartItemResponse, deleteItem: () => void }) {
    const { cartItem, deleteItem } = props;
    return (
        <View style={styles.cartItem}>
            <Image style={styles.itemImage} source={{ uri: cartItem.imageUrl }}/>
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{cartItem.recipeName.length > 18 ? ellipsify(cartItem.recipeName) : cartItem.recipeName}</Text>
                <Text style={styles.servingSize}>{cartItem.servingSize} servings</Text>
                <Text style={styles.price}>{cartItem.price}</Text>
            </View>
            <View style={styles.deleteItem}>
                <Pressable onPress={deleteItem}>
                    <Ionicons name="trash-outline" size={20} color={rasoiBoxGrey} />
                </Pressable>
            </View>
        </View>
    )
}

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
                    <View style={checkoutButtonStyle(cart.length == 0)}>
                        <Pressable disabled={cart.length == 0} onPress={checkout}>
                            <Text style={styles.checkout}>Checkout</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.subtitle}>All promo codes will be applied at checkout.</Text>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        padding: 20,
    },
    itemImage: {
        width: 100,
        height: 70,
        borderRadius: 10
    },
    recipeInfo: {
        paddingLeft: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: 150
    },
    recipeName: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
    },
    servingSize: {
        fontFamily: 'AvenirLight',
        fontSize: 14
    },
    price: {
        fontFamily: 'AvenirLight',
        fontSize: 14,
        flexDirection: 'row-reverse',
    },
    deleteItem: {
        justifyContent: 'center',
        left: 40
    },
    checkoutButton: {
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20
    },
    inactiveCheckoutButton: {
        backgroundColor: 'grey',
        paddingTop: 5,
        paddingBottom: 5,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20
    },
    checkout: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        fontSize: 20
    },
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