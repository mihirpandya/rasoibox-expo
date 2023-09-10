import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';

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
    return (
        <View style={styles.header}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <Ionicons style={styles.profile} name="person-circle-outline" size={25} />
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