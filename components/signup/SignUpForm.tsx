import { Link, Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { signup } from "../../app/api/rasoibox-backend";
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { generateCode } from '../../constants/utils';
import { validateEmail, validateZipcode } from "../../validators/Validators";
import ErrorText from "../common/ErrorText";
import FormKey from "../common/FormKey";
import FormValue from "../common/FormValue";
import * as Storage from "../common/Storage";

export const errorIds = ['no_error', 'email', 'password', 'name', 'zipcode', 'invalid_login'] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
    password: "Password is a required field.",
    name: "Please enter a first and last name.",
    zipcode: "Please enter a valid US zip code.",
    invalid_login: "Unable to log in with provided credentials."
}

export default function SignUpForm() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [zipcode, setZipCode] = useState("")
    const [error, setError] = useState<ErrorID>('no_error')
    const [loading, setLoading] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string | undefined>()

    function fetchAuthDetails() {
        return Storage.getAuthDetails().then(response => {
            setVerificationCode(response?.verification_code)
        })
    }

    useEffect(() => {
        fetchAuthDetails()
    }, [])

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    const code: string = !!verificationCode ? verificationCode : generateCode()

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
        // const loginResponse = await login(email, password)
        const signupResponse = await signup(email, password, firstName, lastName, zipcode, new Date(), code)
        setLoading(false);

        // if (loginResponse["status"] == 0) {
        //     AsyncStorage.setItem(Storage.ACCESS_TOKEN, loginResponse[Storage.ACCESS_TOKEN])
        //     setError('no_error')
        //     setLoggedIn(true)
        //     const authDetails: AuthDetails = {
        //         authenticated: true,
        //         first_name: loginResponse["first_name"],
        //         last_name: loginResponse["last_name"],
        //         email: loginResponse["email"],
        //         verification_code: loginResponse["verification_code"]
        //     }
        //     await Storage.storeAuthDetails(authDetails)
        // } else {
        //     setError('invalid_login')
        // }
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
                                        <FormValue onChangeText={setFirstName} onKeyPress={submitIfEnter} />
                                    </View>
                                    <View style={styles.rowItem}>
                                        <FormKey>Last Name</FormKey>
                                        <FormValue onChangeText={setLastName} onKeyPress={submitIfEnter} />
                                    </View>
                                </View>
                                <FormKey>Email</FormKey>
                                <FormValue secureTextEntry={false} onChangeText={setEmail} onKeyPress={submitIfEnter} />
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
                                {error != 'no_error' && <ErrorText message={ERRORS[error]}/>}
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
