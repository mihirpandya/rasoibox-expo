import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';
import { AuthDetails } from './AuthShim';
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
            <Pressable onPress={togglePressed}>
                <Ionicons style={styles.profile} name="person-circle-outline" size={25} />
            </Pressable>
            <LogoTitle />
            {authDetails?.authenticated && <AntDesign style={styles.cart} name="shoppingcart" size={25} />}
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
    profile: {
        position: 'fixed',
        left: '10%',
        color: rasoiBoxPink,
    },
    cart: {
        position: 'fixed',
        right: '10%',
        color: rasoiBoxPink
    }
});