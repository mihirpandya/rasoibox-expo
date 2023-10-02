import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { validateEmail } from '../../validators/Validators';
import { AuthDetails } from '../common/AuthShim';
import ErrorText from '../common/ErrorText';
import * as Storage from "../common/Storage";

export const errorIds = [
    'no_error', 
    'email', 
] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
}

export default function GetStarted() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<ErrorID>('no_error')

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            onPress();
        }
    }

    function onPress() {
        setError('no_error')
        if (!validateEmail(email)) {
            setError('email');
            return;
        } else {
            Storage.getAuthDetails().then(oldAuthDetails => {
                let newAuthDetails: AuthDetails;
                if (oldAuthDetails == null) {
                    newAuthDetails = {
                        authenticated: false,
                        email: email
                    }
                } else {
                    newAuthDetails = {
                        ...oldAuthDetails,
                        email: email
                    }
                }

                Storage.storeAuthDetails(newAuthDetails).then(_response => {
                    router.replace("/signup")
                })
            })
        }
    }

    return (
        <View style={styles.card}>
            {error != 'no_error' && <ErrorText message={ERRORS[error]}/>}
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder={"Enter email to get started"} onChangeText={setEmail} onKeyPress={submitIfEnter}/>
                <Pressable style={styles.button} onPress={onPress}>
                    <AntDesign name="rightcircle" size={40} color={rasoiBoxYellow} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('screen').width < 700 ? '100%' : '90%',
    },
    form: {
        marginTop: 30,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
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