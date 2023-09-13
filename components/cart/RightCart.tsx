import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCart } from '../../app/api/rasoibox-backend';
import { rasoiBoxGrey, rasoiBoxYellow } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";

interface CartItemResponse {
    recipeName: string,
    imageUrl: string,
    servingSize: number,
    price: number
}

function ellipsify(name: string): string {
    return name.substring(0, 15) + "..."
}

function CartItem(props: { cartItem: CartItemResponse }) {
    const { cartItem } = props;
    return (
        <View style={styles.cartItem}>
            <Image style={styles.itemImage} source={{ uri: cartItem.imageUrl }}/>
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{cartItem.recipeName.length > 18 ? ellipsify(cartItem.recipeName) : cartItem.recipeName}</Text>
                <Text style={styles.servingSize}>{cartItem.servingSize} servings</Text>
                <Text style={styles.price}>{cartItem.price}</Text>
            </View>
            <View style={styles.deleteItem}>
                <Pressable>
                    <Ionicons name="trash-outline" size={20} color={rasoiBoxGrey} />
                </Pressable>
            </View>
        </View>
    )
}

export default function RightCart() {
    const [authDetails, setAuthDetails] = useState<AuthDetails>();
    const [cart, setCart] = useState<CartItemResponse[]>([])

    function fetchCart() {
        if (authDetails?.verification_code != undefined) {
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

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                {cart.length == 0 ? <Text>Empty cart</Text> : <FlatList 
                    data={cart}
                    renderItem={
                        ({item}) => <CartItem cartItem={item}/>
                    }/>}
            </ScrollView>
            <View style={styles.checkoutButton}>
                <Pressable>
                    <Text style={styles.checkout}>Checkout</Text>
                </Pressable>
            </View>
        </View>
    )
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
    checkout: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        fontSize: 20
    }
});