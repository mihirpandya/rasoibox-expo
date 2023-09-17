import React from "react";
import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { rasoiBoxYellow } from '../../constants/Colors';

function checkoutButtonStyle(active: boolean) {
    return active ? styles.checkoutButton : styles.inactiveCheckoutButton;
}

export default function CheckoutButton(props: { active: boolean, loading: boolean, onPress: () => void }) {
    const { active, loading, onPress } = props;
    return (
        <View style={checkoutButtonStyle(active)}>
            {loading ? <ActivityIndicator size={"small"} color='white'/> :
            <Pressable disabled={!active} onPress={onPress}>
                <Text style={styles.checkout}>Checkout</Text>
            </Pressable>}
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
        borderRadius: 20,
        height: 40
    },
    inactiveCheckoutButton: {
        backgroundColor: '#aaaaaa',
        paddingTop: 5,
        paddingBottom: 5,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20,
        height: 40
    },
    checkout: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        fontSize: 20
    },
});