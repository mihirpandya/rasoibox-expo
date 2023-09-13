import React from "react";
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { rasoiBoxYellow } from '../../constants/Colors';

function checkoutButtonStyle(active: boolean) {
    return active ? styles.checkoutButton : styles.inactiveCheckoutButton;
}

export default function CheckoutButton(props: { active: boolean, onPress: () => void }) {
    const { active, onPress } = props;
    return (
        <View style={checkoutButtonStyle(active)}>
            <Pressable disabled={!active} onPress={onPress}>
                <Text style={styles.checkout}>Checkout</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    checkoutButton: {
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20
    },
    inactiveCheckoutButton: {
        backgroundColor: '#aaaaaa',
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
    },
});