import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function FormKey(props: { children: React.ReactNode }) {
    return (
        <Text style={styles.fieldTitle}>
            {props.children}
        </Text>
    )
}

const styles = StyleSheet.create({
    fieldTitle: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        paddingBottom: 20,
    },
});