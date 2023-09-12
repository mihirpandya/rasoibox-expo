import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';

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
        width: Dimensions.get('screen').width < 700 ? '100%' : '90%',
        marginTop: 30,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
    },
    input: {
        height: 50,
        width: Dimensions.get('screen').width < 700 ? '100%' : '50%',
        borderWidth: 2,
        borderColor: rasoiBoxPink,
        borderRadius: 50,
        boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, 0.2)',
        paddingLeft: Dimensions.get('screen').width < 700 ? 15 : 30,
        fontSize: Dimensions.get('screen').width < 700 ? 15 : 18,
        color: 'rgb(100, 100, 100)',
        fontFamily: 'AvenirLight',
    },
    button: {
        marginLeft: -45,
    },
});