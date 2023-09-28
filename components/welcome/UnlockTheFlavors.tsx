import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import FormKey from '../common/FormKey';
import FormValue from '../common/FormValue';
import GetStarted from './GetStarted';

export default function UnlockTheFlavors() {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Unlock the flavors of Rasoi Box!
            </Text>
            <Text style={styles.message}>
                Sign up for free to get early access to our rotating menu and have a say in what you cook next.
            </Text>
            <GetStarted />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        paddingTop: 40,
        // width: Dimensions.get('window').width < 700 ? '95%' : '60%',
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: Dimensions.get('window').width < 700 ? 40 : 55,
        fontFamily: 'CormorantGaramondSemiBold',
        paddingBottom: 20
    },
    message: {
        fontSize: Dimensions.get('window').width < 700 ? 15 : 20,
        fontFamily: 'AvenirLight'
    },
});