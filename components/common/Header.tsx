import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { rasoiBoxGrey, rasoiBoxPink } from '../../constants/Colors';
import LeftMenu from "../LeftMenu";
import RightCart from "../cart/RightCart";
import { AuthDetails } from './AuthShim';
import Lightbox, { LightboxSide } from "./Lightbox";
import * as Storage from "./Storage";

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


export default function Header() {
    const [authDetails, setAuthDetails] = useState<AuthDetails>();
    const [menuPressed, setMenuPressed] = useState<boolean>(false);
    const [cartPressed, setCartPressed] = useState<boolean>(false);

    const toggleMenuPressed = () => {
        const newPressed = !menuPressed;
        setMenuPressed(newPressed);
    }

    const toggleCartPressed = () => {
        const newPressed = !cartPressed;
        setCartPressed(newPressed);
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
            {authDetails?.authenticated && 
                <Pressable style={styles.cart} onPress={toggleCartPressed}>
                    <Ionicons name="cart-outline" size={25} color={rasoiBoxPink}/>
                </Pressable>
            }
            <Lightbox isVisible={cartPressed} width={350} side={LightboxSide.right} closeLightbox={toggleCartPressed}>
                <RightCart closeLightbox={toggleCartPressed}/>
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
    }
});