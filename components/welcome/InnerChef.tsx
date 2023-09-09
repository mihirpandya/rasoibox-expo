import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';

export default function InnerChef() {
    return (
        <View style={styles.card}>
            <View style={styles.left}>
                Unleash your Inner Chef
            </View>
            <View style={styles.right}>
                Personalize your Palate
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: rasoiBoxPink,
        flexDirection: 'row',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    left: {
        width: '50%',
        padding: 100,
        fontSize: 75,
        fontFamily: 'CormorantGaramondSemiBold'
    },
    right: {
        width: '50%',
        fontSize: 25,
        fontFamily: 'AvenirLight'
    }
});