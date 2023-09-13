import React from 'react';
import { Text, StyleSheet, TextInput } from 'react-native';

export default function FormValue(props: { 
    onChangeText: (text: string) => void, 
    onKeyPress: (event: any) => void,
    secureTextEntry?: boolean, 
    defaultValue?: string
}) {

    const { secureTextEntry, onChangeText, onKeyPress, defaultValue } = props;

    return (
        <TextInput 
            style={styles.fieldValue}
            secureTextEntry={secureTextEntry ? true : false}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            defaultValue={defaultValue}
        />
    )
}

const styles = StyleSheet.create({
    fieldValue: {
        height: 30,
        borderBottomWidth: 1,
        padding: 7,
        paddingLeft: 20,
        fontFamily: 'AvenirLight',
        fontSize: 15,
    },
});