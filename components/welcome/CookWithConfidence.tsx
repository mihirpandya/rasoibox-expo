import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import GetStarted from "./GetStarted";
import { rasoiBoxGrey, rasoiBoxYellow, titleColor } from '../../constants/Colors';

function getSloganFontSize(): number {
    const width = Dimensions.get('window').width;
    if (width < 700) {
        return 40;
    } else {
        return 100;
    }
}

function getDescriptionFontSize(): number {
    const width = Dimensions.get('window').width;
    if (width < 700) {
        return 19;
    } else {
        return 25;
    }
}

export default function CookWithConfidence() {
    return (
        <View style={styles.card}>
            <Text style={styles.slogan}>COOK WITH CONFIDENCE</Text>
            <Text style={styles.description}>
                Discover the joy of cooking easy, healthy, fresh and delicious Indian meals with ready-to-cook ingredients and step-by-step instructions from Rasoi Box.
            </Text>
            <GetStarted />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingLeft: Dimensions.get('screen').width < 700 ? '10%' : '20%',
        paddingRight: Dimensions.get('screen').width < 700 ? '10%' : '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: '3%'
    },
    slogan: {
        fontSize: getSloganFontSize(),
        fontFamily: 'CormorantGaramondSemiBold',
        textAlign: 'center',
        color: titleColor
    },
    description: {
        fontSize: getDescriptionFontSize(),
        fontFamily: 'AvenirLight',
        width: Dimensions.get('screen').width < 700 ? '100%' : '50%',
        color: rasoiBoxGrey,
        paddingTop: 20,
        paddingBottom: 20
    },
    button: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: rasoiBoxYellow,
        fontSize: 20,
        fontFamily: 'AvenirLight',
    },
});