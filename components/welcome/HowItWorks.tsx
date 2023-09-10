import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function InnerChef() {
    return (
        <View style={styles.card}>
            <Text>
                How it Works
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        flexDirection: 'row',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
})