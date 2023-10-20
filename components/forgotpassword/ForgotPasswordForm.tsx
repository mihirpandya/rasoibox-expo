import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { emitEvent, initiateResetPassword } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { WebsiteEvent } from '../../constants/EventTypes';
import { validateEmail } from "../../validators/Validators";
import { AuthDetails } from '../common/AuthShim';
import FormKey from "../common/FormKey";
import FormValue from "../common/FormValue";
import ResponseText from "../common/ResponseText";
import * as Storage from "../common/Storage";

export const errorIds = ['no_error', 'email'] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
}

export default function ForgotPasswordForm() {
    document.title = "Forgot Password | Rasoi Box"
    const [email, setEmail] = useState("");
    const [error, setError] = useState<ErrorID>('no_error')
    const [successMessage, setSuccessMessage] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        Storage.getAuthDetails().then((authDetails: AuthDetails | null) => {
            if (authDetails?.verification_code) {
                emitEvent(WebsiteEvent.FORGOT_PASSWORD, new Date(), authDetails?.verification_code)
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

        setLoading(true);
        initiateResetPassword(email).finally(() => {
            setLoading(false)
            setSuccessMessage("We have sent you instructions to reset your password. Your reset password link will expire in 1 hour.")
        })
    }

    return (
        <View style={styles.center}>
            <View style={styles.card}>
                {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{ paddingTop: 50 }} /> :
                    <View style={styles.form}>
                        <Text style={styles.title}>
                            Reset your Password
                        </Text>
                        <Text style={styles.subtitle}>
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </Text>
                        <FormKey>Email</FormKey>
                        <FormValue secureTextEntry={false} onChangeText={setEmail} onKeyPress={submitIfEnter} />
                        {error != 'no_error' && <ResponseText message={ERRORS[error]} />}
                        {error == 'no_error' && successMessage && <ResponseText isError={false} message={successMessage} />}
                        <Pressable style={styles.button} onPress={submit}>
                            <Text style={styles.buttonText}>Continue</Text>
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
        paddingBottom: 30,
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
