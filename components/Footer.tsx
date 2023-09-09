import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Text } from "../components/Themed";

function FooterIcon() {
    return (
        <Image 
            style={styles.icon}
            source={require('../assets/images/icon.png')}
        />
    )
}

export default function Footer() {
    return (
        <View style={styles.footer}>
            <FooterIcon />
            <Text style={{textAlign: 'center'}}>
                hello@rasoibox.com{"\n\n"}
                © Rasoi Box, Inc.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    },
    footer: {
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'     
    },
});