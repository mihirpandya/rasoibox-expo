import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ResponseText(props: {message: string, isError?: boolean}) {
    const { message, isError } = props
    const error = (isError == undefined) ? true : isError
    return (
        <Text style={error ? styles.error : styles.success}>
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
    },
    success: {
        textAlign: 'center',
        color: 'green',
        fontFamily: 'AvenirLight',
        fontSize: 14,
        paddingTop: 10
    }
})