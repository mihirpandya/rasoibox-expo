import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';
import LeftMenu from "../LeftMenu";
import { AuthDetails } from './AuthShim';
import Lightbox from "./Lightbox";
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
    const [pressed, setPressed] = useState<boolean>(false);

    const togglePressed = () => {
        const newPressed = !pressed;
        setPressed(newPressed);
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
            <Pressable onPress={togglePressed} style={styles.menu}>
                <Ionicons name="menu-sharp" size={25} color={'#555555'}/>
            </Pressable>
            <Lightbox isVisible={pressed} closeLightbox={togglePressed}>
                <LeftMenu authDetails={authDetails} onNav={togglePressed}/>
            </Lightbox>
            <LogoTitle />
            {authDetails?.authenticated && 
                <Pressable style={styles.cart}>
                    <Ionicons name="cart-outline" size={25} color={rasoiBoxPink}/>
                </Pressable>
            }
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
        left: 50,
    },
    cart: {
        position: 'fixed',
        right: 50,
    }
});