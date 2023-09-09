import { View, Image, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react';

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
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center' 
    }
});