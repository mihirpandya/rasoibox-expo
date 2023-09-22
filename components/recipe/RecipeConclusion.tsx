import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';

export default function RecipeConclusion() {
    return (
        <View>
            <Text style={styles.title}>
                How did it go?
            </Text>
            <Text style={styles.message}>
                Let us know how it turned out! Write us at hello@rasoibox.com and tag @rasoiboxinc on Instagram.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        color: rasoiBoxPink,
        fontSize: 25,
        paddingBottom: 10,
    },
    message: {
        fontFamily: 'AvenirLight',
        fontSize: 17
    }
})