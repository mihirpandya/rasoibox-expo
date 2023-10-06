import { Link, Redirect, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { createAccount, emitEvent } from "../../app/api/rasoibox-backend";
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { generateCode, loginSession } from '../../constants/utils';
import { validateEmail, validateZipcode } from "../../validators/Validators";
import ResponseText from "../common/ResponseText";
import FormKey from "../common/FormKey";
import FormValue from "../common/FormValue";
import * as Storage from "../common/Storage";
import { AuthDetails } from '../common/AuthShim';
import { WebsiteEvent } from '../../constants/EventTypes';

export const errorIds = [
    'no_error', 
    'email', 
    'password', 
    'name', 
    'zipcode',
    'already_exists',
    'unknown_error',
    'success',
    'success_verified',
    'invalid_login'
] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
    password: "Password is a required field.",
    name: "Please enter a first and last name.",
    zipcode: "Please enter a valid US zip code.",
    already_exists: "This account already exists. If you have forgotten your password, go to the log in page to reset your password.",
    success: "Your account has been created successfully. Please check your email to verify your account.",
    success_verified: "Your account has been successfully verified! Signing you in and redirecting you to our menu.",
    unknown_error: "We could not create your account. Please check your entries and try submitting the form again.",
    invalid_login: "Unable to log in with provided credentials."
}

export default function SignUpForm() {
    document.title = "Create Account | Rasoi Box"

    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [zipcode, setZipCode] = useState("")
    const [error, setError] = useState<ErrorID>('no_error')
    const [loading, setLoading] = useState<boolean>(false);
    const [authDetails, setAuthDetails] = useState<AuthDetails | undefined>()

    function fetchAuthDetails() {
        return Storage.getAuthDetails().then(response => {
            if (response != null) {
                setAuthDetails(response)
            }
        })
    }

    useEffect(() => {
        if (authDetails?.email) {
            setEmail(authDetails.email)
        }
        if (authDetails?.verification_code) {
            emitEvent(WebsiteEvent.CREATE_ACCOUNT, new Date(), authDetails.verification_code)
        }
    }, [authDetails])

    useEffect(() => {
        fetchAuthDetails()
    }, [])

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    const code: string = !!authDetails?.verification_code ? authDetails.verification_code : generateCode()

    async function submit() {
        setError('no_error');

        if (firstName.length < 1 || lastName.length < 1) {
            setError('name');
            return;
        }

        if (!validateEmail(email)) {
            setError('email');
            return;
        }

        if (password.length == 0) {
            setError('password');
            return;
        }

        if (!validateZipcode(zipcode)) {
            setError('zipcode');
            return;
        }

        setLoading(true);
        const signupResponse = await createAccount(email, password, firstName, lastName, zipcode, new Date(), code)
        setLoading(false);

        const signupStatus: number | undefined = signupResponse["status"]

        if (signupStatus == 0) {
            setError('success')
        } else if (signupStatus == 1) {
            setError('success_verified')
            loginSession(email, password).then(_success => {
                setLoggedIn(true);
            }).catch(_error => {
                setError('invalid_login')
            })
        } else if (signupStatus == -1) {
            setError('already_exists')
        } else {
            setError('unknown_error')
        }
    }

    if (loggedIn) {
        return <Redirect href="/menu" />
    } else {
        return (
            <View style={styles.center}>
                {/* <ScrollView> */}
                    <View style={styles.card}>
                        {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/> : 
                            <View style={styles.form}>
                                <Text style={styles.title}>
                                    Create your Account
                                </Text>
                                <View style={styles.row}>
                                    <View style={styles.rowItem}>
                                        <FormKey>First Name</FormKey>
                                        <FormValue onChangeText={setFirstName} onKeyPress={submitIfEnter} defaultValue={firstName}/>
                                    </View>
                                    <View style={styles.rowItem}>
                                        <FormKey>Last Name</FormKey>
                                        <FormValue onChangeText={setLastName} onKeyPress={submitIfEnter} defaultValue={lastName}/>
                                    </View>
                                </View>
                                <FormKey>Email</FormKey>
                                <FormValue secureTextEntry={false} onChangeText={setEmail} onKeyPress={submitIfEnter} defaultValue={email}/>
                                <View style={styles.row}>
                                    <View style={styles.rowItem}>
                                        <FormKey>Password</FormKey>
                                        <FormValue secureTextEntry={true} onChangeText={setPassword} onKeyPress={submitIfEnter} />
                                    </View>
                                    <View style={styles.rowItem}>
                                        <FormKey>Postal / Zip Code</FormKey>
                                        <FormValue onChangeText={setZipCode} onKeyPress={submitIfEnter} />
                                    </View>
                                </View>
                                {error != 'no_error' && <ResponseText message={ERRORS[error]}/>}
                                <Pressable style={styles.button} onPress={submit}>
                                    <Text style={styles.buttonText}>Create New Account</Text>
                                </Pressable>
                                <View style={styles.signin}>
                                    <Text style={styles.signinText}>Have an account?</Text>
                                    <Link href="/signin">
                                        <Text style={styles.forgotPassword}>Sign In</Text>
                                    </Link>
                                </View>
                            </View>
                        }
                    </View>
                {/* </ScrollView> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        height: Dimensions.get('window').width < 700 ? '100%' : 600,
        width: Dimensions.get('window').width < 700 ? '100%' : 570,
        borderRadius: 10,
        boxShadow: Dimensions.get('window').width > 700 && '2px 2px 20px 2px rgba(0, 0, 0, 0.2)',
    },
    center: {
        alignItems: 'center',
        height: '100%',
        paddingTop: Dimensions.get('window').width < 700 ? 0 : 50,
        backgroundColor: 'white',
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 30,
        paddingTop: Dimensions.get('window').width < 700 ? 0 : 50,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Dimensions.get('window').width < 700 ? 10 : 20,
        paddingBottom: Dimensions.get('window').width < 700 ? 10 : 20
    },
    rowItem: {
        width: '48%'
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
    signin: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20
    },
    signinText: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingRight: 5,
    },
});
