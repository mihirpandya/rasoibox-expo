import { Link, Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { emitEvent } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { WebsiteEvent } from '../../constants/EventTypes';
import { loginSession } from '../../constants/utils';
import { validateEmail } from "../../validators/Validators";
import { AuthDetails } from '../common/AuthShim';
import FormKey from "../common/FormKey";
import FormValue from "../common/FormValue";
import ResponseText from "../common/ResponseText";
import * as Storage from "../common/Storage";

export const errorIds = ['no_error', 'email', 'password', 'invalid_login'] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
    password: "Password is a required field.",
    invalid_login: "Unable to log in with provided credentials."
}

export default function SignInForm() {
    document.title = "Sign In | Rasoi Box"
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<ErrorID>('no_error')
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        Storage.getAuthDetails().then((authDetails: AuthDetails | null) => {
            if (authDetails?.verification_code) {
                emitEvent(WebsiteEvent.SIGNIN, new Date(), authDetails?.verification_code)
            }
        })
    }, [])

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    async function submit() {
        setError('no_error')

        if (!validateEmail(email)) {
            setError('email');
            return;
        }

        if (password.length == 0) {
            setError('password');
            return;
        }

        setLoading(true);
        loginSession(email, password).then(_success => {
            setLoggedIn(true);
        }).catch(error => {
            setError('invalid_login')
        }).finally(() => setLoading(false))
    }

    if (loggedIn) {
        return <Redirect href="/menu" />
    } else {
        return (
            <View style={styles.center}>
                <View style={styles.card}>
                    {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/> : 
                        <View style={styles.form}>
                            <Text style={styles.title}>
                                Welcome Back!
                            </Text>
                            <FormKey>Email</FormKey>
                            <FormValue secureTextEntry={false} onChangeText={setEmail} onKeyPress={submitIfEnter} />
                            <View style={styles.password}>
                                <FormKey>Password</FormKey>
                                {/* <Link href="/forgotpassword">
                                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                                </Link> */}
                            </View>
                            <FormValue secureTextEntry={true} onChangeText={setPassword} onKeyPress={submitIfEnter} />
                            {error != 'no_error' && <ResponseText message={ERRORS[error]}/>}
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
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        height: Dimensions.get('window').width < 700 ? '100%' : 500,
        width: Dimensions.get('window').width < 700 ? '100%' : 485,
        borderRadius: 10,
        boxShadow: Dimensions.get('window').width > 700 && '2px 2px 20px 2px rgba(0, 0, 0, 0.2)',
    },
    center: {
        alignItems: 'center',
        height: '100%',
        paddingTop: Dimensions.get('window').width < 700 ? 10 : 50,
        backgroundColor: 'white'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 50,
        paddingTop: Dimensions.get('window').width < 700 ? 0 : 50,
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
        paddingLeft: Dimensions.get('window').width < 700 ? 20 : 50,
        paddingRight: Dimensions.get('window').width < 700 ? 20 : 50
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
    },
});
