import { View, Image, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { rasoiBoxPink } from '../constants/Colors';

function LogoTitle() {
    return (
        <Link href="/">
          <Image
            style={styles.logo}
            source={require('../assets/images/header_logo.svg')}
          />
        </Link>
    );
}

export default function Header() {
    return (
        <View style={styles.header}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <FontAwesome5 style={styles.profile} name="user-circle" size={24} color="black" />
            <LogoTitle />
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
    }
});