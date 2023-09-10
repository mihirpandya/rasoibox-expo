import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Redirect } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from "../../app/api/rasoibox-backend";
import { rasoiBoxYellow } from '../../constants/Colors';
import * as Storage from "../../constants/Storage";
import { validateEmail } from "../../validators/Validators";
import ErrorText from "../common/ErrorText";

export const errorIds = ['no_error', 'email', 'password', 'invalid_login'] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
    password: "Password is a required field.",
    invalid_login: "Unable to log in with provided credentials."
}

export default function SignInForm() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<ErrorID>('no_error')

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    async function submit() {
        if (!validateEmail(email)) {
            setError('email');
            return;
        }

        if (password.length == 0) {
            setError('password');
            return;
        }

        const loginResponse = await login(email, password)
        console.log(loginResponse);

        if (loginResponse["status"] == 0) {
            AsyncStorage.setItem(Storage.ACCESS_TOKEN, loginResponse[Storage.ACCESS_TOKEN])
            setError('no_error')
            setLoggedIn(true)
        } else {
            setError('invalid_login')
        }
    }

    if (loggedIn) {
        return <Redirect href="/menu" />
    } else {
        return (
            <View style={styles.center}>
                <View style={styles.card}>
                    <View style={styles.form}>
                        <Text style={styles.title}>
                            Welcome Back!
                        </Text>
                        <Text style={styles.fieldTitle}>
                            Email
                        </Text>
                        <TextInput style={styles.fieldValue} onChangeText={setEmail} onKeyPress={submitIfEnter}/>
                        <View style={styles.password}>
                            <Text style={styles.fieldTitle}>
                                Password
                            </Text>
                            <Link href="/forgotpassword">
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </Link>
                        </View>
                        <TextInput style={styles.fieldValue} secureTextEntry={true} onChangeText={setPassword} onKeyPress={submitIfEnter}/>
                        {error != 'no_error' && <ErrorText message={ERRORS[error]}/>}
                        <Pressable style={styles.button} onPress={submit}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </Pressable>
                        <View style={styles.signup}>
                            <Text style={styles.signupText}>New to Rasoi Box?</Text>
                            <Link href="/signup">
                                <Text style={styles.forgotPassword}>Sign Up</Text>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        height: 500,
        width: 485,
        borderRadius: 10,
        boxShadow: '2px 2px 20px 2px rgba(0, 0, 0, 0.2)',
    },
    center: {
        alignItems: 'center',
        height: '100%',
        paddingTop: 50,
        backgroundColor: 'white'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 50
    },
    fieldTitle: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        paddingBottom: 20,
    },
    fieldValue: {
        height: 30,
        borderBottomWidth: 1,
        padding: 7,
        paddingLeft: 20,
        fontFamily: 'AvenirLight',
        fontSize: 15,
    },
    password: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 30
    },
    forgotPassword: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        color: rasoiBoxYellow,
        textDecorationLine: 'underline'
    },
    form: {
        padding: 50
    },
    button: {
        marginTop: 30,
        width: '100%',
        height: 40,
        backgroundColor: rasoiBoxYellow,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        color: 'white',
        fontSize: 17,
    },
    signup: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20
    },
    signupText: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingRight: 5,
    }
});
