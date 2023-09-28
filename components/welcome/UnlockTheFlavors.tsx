import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormKey from '../common/FormKey';
import FormValue from '../common/FormValue';

export default function UnlockTheFlavors() {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Unlock the flavors of Rasoi Box!
            </Text>
            <Text style={styles.message}>
                Sign up for free to get early access to our rotating menu and have a say in what you cook next.
            </Text>
            <View style={{flexDirection: 'row'}}>
                <View>
                    <FormKey>Email</FormKey>
                    <FormValue />
                </View>
                <View>
                    <FormKey>Postal / Zip code</FormKey>
                    <FormValue />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        paddingTop: 30,
    },
    title: {
        fontSize: 55,
        fontFamily: 'CormorantGaramondSemiBold',
    },
    message: {
        fontSize: 20,
        fontFamily: 'AvenirLight'
    },
});