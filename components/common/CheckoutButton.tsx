import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxYellow } from '../../constants/Colors';

export enum CheckoutStatus { checkout, loading, success }

function checkoutButtonStyle(active: boolean) {
    return active ? styles.checkoutButton : styles.inactiveCheckoutButton;
}

export default function CheckoutButton(props: { active: boolean, checkoutStatus: CheckoutStatus, onPress: () => void }) {
    const { active, checkoutStatus: buttonStatus, onPress } = props;

    function buttonLabelFromStatus() {
        if (buttonStatus == CheckoutStatus.checkout) {
            return (
                <Pressable disabled={!active} onPress={onPress}>
                    <Text style={styles.checkout}>Checkout</Text>
                </Pressable>
            );
        } else if (buttonStatus == CheckoutStatus.loading) {
            return (<ActivityIndicator size={"small"} color='white'/>);
        } else {
            // success
            return (<Text style={styles.checkout}>Success!</Text>);
        }
    }
    return (
        <View style={checkoutButtonStyle(active)}>
            {buttonLabelFromStatus()}
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