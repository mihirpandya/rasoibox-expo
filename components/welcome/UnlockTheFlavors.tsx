import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import GetStarted from './GetStarted';

export default function UnlockTheFlavors(props: {
    setCoordinate: (coordinate: number) => void
}) {

    const { setCoordinate } = props;
    return (
        <View style={styles.card} onLayout={(event) => {
                setCoordinate(event.nativeEvent.layout.y)
            }}>
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