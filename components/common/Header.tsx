import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import LeftMenu from "../LeftMenu";
import RightCart from "../cart/RightCart";
import { AuthDetails } from './AuthShim';
import Lightbox, { LightboxSide } from "./Lightbox";
import * as Storage from "./Storage";
import { CartItemResponse } from './CartItem';
import { getCart } from '../../app/api/rasoibox-backend';

function LogoTitle() {
    return (
        <Link href="/">
          <Image
            style={styles.logo}
            source={require('../../assets/images/header_logo.svg')}
          />
        </Link>
    );
}


export default function Header(props: {
    updateCart?: boolean
    setUpdateCart?: (update: boolean) => void
}) {
    const { updateCart, setUpdateCart, openCart } = props;
    const [authDetails, setAuthDetails] = useState<AuthDetails>();
    const [menuPressed, setMenuPressed] = useState<boolean>(false);
    const [cartPressed, setCartPressed] = useState<boolean>(false);
    const [cartSize, setCartSize] = useState<number>(0)
    const [cartLoading, setCartLoading] = useState<boolean>(true);
    const [cart, setCart] = useState<CartItemResponse[]>([])

    const toggleMenuPressed = () => {
        const newPressed = !menuPressed;
        setMenuPressed(newPressed);
    }

    const toggleCartPressed = () => {
        const newPressed = !cartPressed;
        setCartPressed(newPressed);
    }

    function fetchCart() {
        if (authDetails?.verification_code != undefined) {
            setCartLoading(true);
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
                setCartSize(cartItems.length)
                setCartLoading(false);
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
    }, [updateCart])

    useEffect(() => {
        fetchCart()
    }, [authDetails])

    useEffect(() => {
        if (setUpdateCart && updateCart) {
            fetchCart()
            setUpdateCart(false)
        }
    }, [updateCart])

    return (
        <View style={styles.header}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <Pressable onPress={toggleMenuPressed} style={styles.menu}>
                <Ionicons name="menu-sharp" size={25} color={rasoiBoxGrey}/>
            </Pressable>
            <Lightbox isVisible={menuPressed} width={300} side={LightboxSide.left} closeLightbox={toggleMenuPressed}>
                <LeftMenu authDetails={authDetails} onNav={toggleMenuPressed}/>
            </Lightbox>
            <LogoTitle />
            <Pressable style={styles.cart} onPress={toggleCartPressed}>
                <Ionicons name="cart-outline" size={25} color={rasoiBoxPink}/>
                {cartSize > 0 && 
                    <View style={styles.cartSize}>
                        <Text style={styles.cartSizeText}> {cartSize} </Text>
                    </View>
                }
            </Pressable>
            <Lightbox isVisible={cartPressed} width={350} side={LightboxSide.right} closeLightbox={toggleCartPressed}>
                <RightCart loading={cartLoading} cart={cart} closeLightbox={toggleCartPressed} fetchCart={fetchCart}/>
            </Lightbox>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 50
    },
    header: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    // icons
    menu: {
        position: 'fixed',
        left: '5%',
    },
    cart: {
        position: 'fixed',
        right: '5%',
    },
    cartSize: {
        backgroundColor: rasoiBoxYellow,
        marginTop: -10,
        marginLeft: 15,
        borderRadius: 10,
        width: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartSizeText: {
        textAlign: 'center',
        fontSize: 10,
        color: 'white',
        fontFamily: 'AvenirLight',
        fontWeight: 'bold',
    }
});