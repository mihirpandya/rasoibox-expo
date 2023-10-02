import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { joinWaitlist } from '../../app/api/rasoibox-backend';
import { rasoiBoxYellow } from '../../constants/Colors';
import { generateCode } from '../../constants/utils';
import { validateEmail, validateZipcode } from '../../validators/Validators';
import { AuthDetails } from '../common/AuthShim';
import FormKey from '../common/FormKey';
import FormValue from '../common/FormValue';
import * as Storage from "../common/Storage";
import ResponseText from '../common/ResponseText';

export const errorIds = [
    'no_error',
    'email',
    'zipcode'
] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter a valid email address.",
    zipcode: "Please enter a valid US zip code."
}

export const successIds = [
    'no_success',
    'already_verified',
    'signed_up',
    'not_verified'
]
type SuccessID = typeof successIds[number];

const SUCCESS: Record<SuccessID, string> = {
    no_success: "There is no message to show.",
    already_verified: "Thanks for your interest; your email has already been verified!",
    signed_up: "You're almost there! We've sent you an email to complete your sign up. If you don't see it, you may need to check your spam folder.",
    not_verified: "Looks like you have signed up but we have not been able to verify your email. We have sent you another verification email. If you don't see it, you may need to check your spam folder."
}

export default function UnlockTheFlavors(props: {
    setCoordinate: (coordinate: number) => void
}) {

    const { setCoordinate } = props;

    const [email, setEmail] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [error, setError] = useState<ErrorID>('no_error')
    const [success, setSuccess] = useState<SuccessID>('no_success')

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    function submit() {
        setError('no_error')
        setSuccess('no_success')

        if (!validateEmail(email)) {
            setError('email');
            return;
        } else if (!validateZipcode) {
            setError('zipcode')
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

                const verificationCode: string = newAuthDetails.verification_code ? newAuthDetails.verification_code : generateCode()

                joinWaitlist(email, zipcode, verificationCode, new Date()).then(response => {
                    const status = response["status"]
                    const verificationCode = response["verification_code"]
                    if (status == 0) {
                        setSuccess('already_verified')
                    } else if (status == 1) {
                        setSuccess('not_verified')
                    } else {
                        setSuccess('signed_up')
                    }

                    return verificationCode
                }).then(verificationCode => {
                    const authDetails = {
                        ...newAuthDetails,
                        verificationCode: verificationCode
                    }
                    Storage.storeAuthDetails(authDetails)
                })
            })
        }
    }

    return (
        <View style={styles.card} onLayout={(event) => {
            setCoordinate(event.nativeEvent.layout.y)
        }}>
            <Text style={styles.title}>
                Unlock the flavors of Rasoi Box!
            </Text>
            <Text style={styles.message}>
                Sign up for free to get early access to our rotating menu and have a say in what you cook next.
            </Text>
            {/* <GetStarted /> */}
            <View style={styles.form}>
                <View style={styles.row}>
                    <View style={styles.email}>
                        <FormKey>
                            <Text>
                                Email
                            </Text>
                        </FormKey>
                        <FormValue onChangeText={setEmail} onKeyPress={submitIfEnter} />
                    </View>
                    <View style={styles.zipcode}>
                        <FormKey>
                            <Text>
                                Zipcode
                            </Text>
                        </FormKey>
                        <FormValue onChangeText={setZipcode} onKeyPress={submitIfEnter} />
                    </View>
                </View>
                {error != 'no_error' && <ResponseText message={ERRORS[error]}/>}
                {error == 'no_error' && success != 'no_success' && <ResponseText message={SUCCESS[success]} isError={false}/>}
                <View style={styles.button}>
                    <Pressable onPress={submit}>
                        <Text style={styles.buttonText}>
                            Submit
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        paddingTop: 40,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: Dimensions.get('window').width < 700 ? 40 : 55,
        fontFamily: 'CormorantGaramondSemiBold',
        paddingBottom: 20
    },
    message: {
        fontSize: Dimensions.get('window').width < 700 ? 15 : 20,
        fontFamily: 'AvenirLight'
    },
    form: {
        paddingTop: Dimensions.get('window').width < 700 ? 30 : 40,
        paddingBottom: Dimensions.get('window').width < 700 ? 10 : 20,
        width: Dimensions.get('window').width < 700 ? '97%' : '58%'
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        paddingBottom: 20,
    },
    email: {
        width: Dimensions.get('window').width < 700 ? '100%' : '62%',
        paddingRight: Dimensions.get('window').width < 700 ? 0 : 30
    },
    zipcode: {
        marginTop: Dimensions.get('window').width < 700 ? 20 : 0,
        width: Dimensions.get('window').width < 700 ? '100%' : '32%',
    },
    button: {
        marginTop: 30,
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 20,
        height: 40,
        width: 150
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        color: 'white',
        fontSize: 15,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 5,
        paddingBottom: 5
    }
});