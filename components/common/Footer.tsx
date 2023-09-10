import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

function FooterIcon() {
    return (
        <Image 
            style={styles.icon}
            source={require('../../assets/images/icon.png')}
        />
    )
}

export default function Footer() {
    return (
        <View style={styles.footer}>
            <FooterIcon />
            <Text style={styles.text}>
                hello@rasoibox.com{"\n\n"}
                © Rasoi Box, Inc.{"\n\n\n"}
                Terms and Conditions
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
        paddingTop: 50,
        paddingBottom: 50,
        alignItems: 'center',
        justifyContent: 'center'     
    },
    text: {
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        fontSize: 14,
        color: '#555555'
    }
});