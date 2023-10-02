import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Pressable } from 'react-native';
import { validateEmail, validateZipcode } from '../../validators/Validators';
import FormKey from '../common/FormKey';
import FormValue from '../common/FormValue';
import * as Storage from "../common/Storage";
import { AuthDetails } from '../common/AuthShim';
import { rasoiBoxYellow } from '../../constants/Colors';

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

export default function UnlockTheFlavors(props: {
    setCoordinate: (coordinate: number) => void
}) {

    const { setCoordinate } = props;

    const [email, setEmail] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [error, setError] = useState<ErrorID>('no_error')

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    function submit() {
        setError('no_error')
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

                Storage.storeAuthDetails(newAuthDetails).then(_response => {
                    
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
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row'
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