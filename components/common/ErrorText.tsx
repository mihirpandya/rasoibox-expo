import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ErrorText(props: any) {
    return (
        <Text style={styles.error}>
            {props.message}
        </Text>
    )
}

const styles = StyleSheet.create({
    error: {
        textAlign: 'center',
        color: 'red',
        fontFamily: 'AvenirLight',
        fontSize: 14,
        paddingTop: 10
    }
})