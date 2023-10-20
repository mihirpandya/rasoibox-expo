import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { completeResetPassword, emitEvent, initiateResetPassword, isResetPasswordAllowed } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { WebsiteEvent } from '../../constants/EventTypes';
import { validateEmail } from "../../validators/Validators";
import { AuthDetails } from '../common/AuthShim';
import FormKey from "../common/FormKey";
import FormValue from "../common/FormValue";
import ResponseText from "../common/ResponseText";
import * as Storage from "../common/Storage";
import { Link } from 'expo-router';

export const errorIds = ['no_error', 'email', 'password', 'invalid_request'] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
    password: "Password is a required field.",
    invalid_request: "Invalid password reset request. Please try resetting password from the log in page."
}

export const resetErrorIds = ['no_error', 'expired', 'invalid']
type ResetErrorID = typeof resetErrorIds[number];
const RESET_ERRORS: Record<ResetErrorID, string> = {
    no_error: "There is no error. No message to show.",
    expired: "Your reset password link has expired. Request a new link by selecting 'Resend Link'.",
    invalid: "Invalid password reset request. Request a new link by selecting 'Resend Link'."
}

export default function ResetPasswordForm() {
    document.title = "Reset Password | Rasoi Box"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetError, setResetError] = useState<ResetErrorID>('no_error')
    const [error, setError] = useState<ErrorID>('no_error')
    const [successMessage, setSuccessMessage] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false);

    const parsedUrl: URL = new URL(location.href)
    const resetId: string | null = parsedUrl.searchParams.get('id')

    useEffect(() => {
        Storage.getAuthDetails().then((authDetails: AuthDetails | null) => {
            if (authDetails?.verification_code) {
                emitEvent(WebsiteEvent.RESET_PASSWORD, new Date(), authDetails?.verification_code)
            }
        })
    }, [])

    useEffect(() => {
        if (resetId) {
            setLoading(true);
            isResetPasswordAllowed(resetId).then(response => {
                if (response["status"] == 0 && response["email"] != undefined) {
                    // $w('#email').value = response["email"];
                    // valid_reset_code = reset_code;
                } else if (response["status"] == -2) {
                    // hideResetForm()
                    // $w('#invalidResetMessage').text = "Your reset password link has expired. Request a new link by selecting 'Resend Link'."
                    // $w('#invalidResetMessage').show()
                    // $w('#resetPassword').show()
                    setResetError('expired')
                } else {
                    // hideResetForm()
                    // $w('#invalidResetMessage').text = "Invalid password reset request. Request a new link by selecting 'Resend Link'."
                    // $w('#invalidResetMessage').show()
                    // $w('#resetPassword').show()
                    setResetError('invalid')
                }
            }).finally(() => setLoading(false))
        } else {
            setResetError('invalid')
        }
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
        if (resetId) {
            completeResetPassword(resetId, password).then((response) => {
                if (response["status"] == 0) {
                    setSuccessMessage("Password reset successfully! Redirecting you to the log in page.")
                    window.open("/signin", "_self")
                } else {
                    setError('invalid_request')
                }
            }).catch(_error => {
                setError('invalid_request')
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    return (
        <View style={styles.center}>
            <View style={styles.card}>
                {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{ paddingTop: 50 }} /> :
                    <View style={styles.form}>
                        <Text style={styles.title}>
                            Choose New Password
                        </Text>
                        <Text style={styles.subtitle}>
                            Create a password that hasn't been used before.
                        </Text>
                        {resetError != 'no_error' && <ResponseText message={RESET_ERRORS[resetError]} />}
                        <FormKey>Email</FormKey>
                        <FormValue secureTextEntry={false} onChangeText={setEmail} onKeyPress={submitIfEnter} />
                        <View style={styles.password}>
                            <FormKey>Password</FormKey>
                            <Link href="/forgotpassword">
                                <Text style={styles.forgotPassword}>Resend Link</Text>
                            </Link>
                        </View>
                        <FormValue secureTextEntry={true} onChangeText={setPassword} onKeyPress={submitIfEnter} />
                        {error != 'no_error' && <ResponseText message={ERRORS[error]} />}
                        {error == 'no_error' && successMessage && <ResponseText isError={false} message={successMessage} />}
                        <Pressable style={styles.button} onPress={submit}>
                            <Text style={styles.buttonText}>Reset Password Now</Text>
                        </Pressable>
                        <View style={styles.signup}>
                            <Text style={styles.signupText}>Having trouble? Email us at hello@rasoibox.com</Text>
                        </View>
                    </View>
                }
            </View>
        </View>
    )
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
        paddingBottom: 10,
        paddingTop: Dimensions.get('window').width < 700 ? 0 : 50,
    },
    subtitle: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingBottom: 10,
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
