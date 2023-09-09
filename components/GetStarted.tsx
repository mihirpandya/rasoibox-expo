import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { rasoiBoxYellow } from '../constants/Colors';

export default function GetStarted() {
    const [text, setText] = useState("");

    function onPress() {

    }

    return (
        <View style={styles.card}>
            <TextInput style={styles.input} placeholder={"Enter email to get started"} onChangeText={setText}/>
            <Pressable style={styles.button} onPress={onPress}>
                <AntDesign name="rightcircle" size={40} color={rasoiBoxYellow} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '70%',
        margin: 30,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
    },
    input: {
        height: 50,
        width: '90%',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 50,
        boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgb(250, 250, 250)',
        paddingLeft: 30,
        fontSize: 18,
        color: 'rgb(100, 100, 100)',
        fontFamily: 'AvenirLight',
    },
    button: {
        marginLeft: -45,
    },
});