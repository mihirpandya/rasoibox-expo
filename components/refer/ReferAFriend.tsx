import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { rasoiBoxYellow } from "../../constants/Colors";
import { generateCode } from "../../constants/utils";
import { validateEmail } from "../../validators/Validators";
import { AuthDetails } from "../common/AuthShim";
import FormKey from "../common/FormKey";
import FormValue from "../common/FormValue";
import ResponseText from "../common/ResponseText";
import * as Storage from "../common/Storage";
import { emitEvent, initiateInvitation } from "../../app/api/rasoibox-backend";
import { WebsiteEvent } from "../../constants/EventTypes";

export const errorIds = ['no_error', 'email', 'self', 'success'] as const;
type ErrorID = typeof errorIds[number];

const ERRORS: Record<ErrorID, string> = {
    no_error: "There is no error. No message to show.",
    email: "Please enter valid emails.",
    self: "Hahah... if you're looking for more ways to save on Rasoi Box, all you have to do is email hello@rasoibox.com",
    success: "Thanks for spreading the Rasoi Box love! Please remind your friends to check their email for their offer. When they redeem their discount, you will receive a 20% off promo code for your next order."
}

function getReferredEmails(referredEmails: string | undefined): string[] {
    if (!referredEmails) {
        return []
    }

    if (referredEmails.length == 0) {
        return [];
    }

    const emails: string[] = referredEmails.split(",")
    const validEmails: string[]  = []
    emails.forEach(email => {
        const cleanEmail: string = email.trim()
        if (validateEmail(cleanEmail)) {
            validEmails.push(cleanEmail)
        }
    })

    if (emails.length == validEmails.length) {
        return validEmails
    } else {
        return []
    }

}

export default function ReferAFriend() {
    document.title = "Refer a Friend | Rasoi Box"
    const [authDetails, setAuthDetails] = useState<AuthDetails | undefined>(undefined);
    const [referrerEmail, setReferrerEmail] = useState<string | undefined>()
    const [referredEmails, setReferredEmails] = useState<string | undefined>()
    const [error, setError] = useState<ErrorID>('no_error')
    const [loading, setLoading] = useState<boolean>(false);
    const [referralFails, setReferralFails] = useState<string[]>([])

    function storeAuthDetails() {
        Storage.getAuthDetails().then(async authDetails => {
            if (authDetails != null) {
                setAuthDetails(authDetails)
                setReferrerEmail(authDetails.email)
            }
        })
    }

    useEffect(() => {
        storeAuthDetails()
    }, [])

    useEffect(() => {
        if (authDetails?.verification_code) {
            const parsedUrl: URL = new URL(location.href)
            const referrer: string | null = parsedUrl.searchParams.get('ref')
            emitEvent(WebsiteEvent.REFER_FRIEND, new Date(), authDetails.verification_code, referrer)
        }
    }, [authDetails])

    function submitIfEnter(event: any) {
        if (event.key === "Enter") {
            submit();
        }
    }

    function getReferralFailureMessage(): string {
        return "We were unable to refer the following people because they have already joined the Rasoi Box community: " + referralFails.join(", ")
    }

    function submit() {
        setError('no_error')

        if (!referrerEmail || !validateEmail(referrerEmail)) {
            setError('email')
            return;
        }

        const cleanReferredEmails = getReferredEmails(referredEmails)

        if (cleanReferredEmails.length == 0) {
            setError('email')
            return;
        }

        setLoading(true)
        initiateInvitation(referrerEmail, cleanReferredEmails, authDetails?.verification_code).then(response => {
            const successes: string[] = response['successes']
            const failures: string[] = response['failures']

            if (successes.length > 0) {
                setError('success')
            }

            if (failures.length > 0) {
                setReferralFails(failures)
            }

        }).finally(() => setLoading(false))
    }

    return (
        <View style={styles.body}>
            <View style={styles.card}>
                <View style={styles.container}>
                    <View style={styles.refer}>
                        <Text style={styles.title}>
                            Spread the love!
                        </Text>
                        <Text style={styles.subtitle}>
                            Refer your friends to Rasoi Box and both of you will receive 20% off your next order!
                        </Text>
                        <View style={styles.referralForm}>
                            <View style={{paddingBottom: 30}}>
                                <FormKey>Your Email</FormKey>
                                <FormValue onChangeText={setReferrerEmail} onKeyPress={submitIfEnter} defaultValue={referrerEmail}></FormValue>
                            </View>
                            <View style={{paddingBottom: 30}}>
                                <FormKey>Your friends' email</FormKey>
                                <FormValue onChangeText={setReferredEmails} onKeyPress={submitIfEnter}></FormValue>
                                <Text style={styles.eg}>
                                    friend1@email.com, friend2@email.com...
                                </Text>
                            </View>
                        </View>
                        {error != 'no_error' && <ResponseText message={ERRORS[error]} isError={error != 'success'}/>}
                        {referralFails.length > 0 && <ResponseText message={getReferralFailureMessage()} />}
                        <View style={referrerEmail && referredEmails ? styles.button : styles.inactiveButton}>
                            <Pressable onPress={submit} disabled={!referrerEmail || !referredEmails}>
                                {loading ? <ActivityIndicator size={"small"} color='white'/> : 
                                <Text style={styles.submit}>
                                    Submit
                                </Text>}
                            </Pressable>
                        </View>
                    </View>
                </View>
                {Dimensions.get('window').width >= 700 && 
                    <View style={styles.container}>
                        <Image style={styles.image} source={{uri: 'https://static.wixstatic.com/media/bbf858_496477da5c3b440885139801b90377ae~mv2.png'}}/>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    card: {
        backgroundColor: 'white',
        // margin: Dimensions.get('window').width < 700 ? 0 : 50,
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    refer: {
        paddingLeft: Dimensions.get('window').width < 700 ? 20 : 150,
        paddingRight: Dimensions.get('window').width < 700 ? 20 : 150,
        paddingTop: Dimensions.get('window').width < 700 ? 20 : 50,
        paddingBottom: Dimensions.get('window').width < 700 ? 20 : 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        marginTop: 50,
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').height * 0.7,
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: Dimensions.get('window').width < 700 ? 40 : 56,
        paddingBottom: 50
    },
    subtitle: {
        fontFamily: 'AvenirLight',
        fontSize: 16,
        textAlign: 'center'
    },
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
    },
    referralForm: {
        paddingTop: 50,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    eg: {
        fontSize: 12,
        paddingTop: 5,
        color: '#a0a0a0',
        fontFamily: 'AvenirLight'
    },
    button: {
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20,
        height: 40,
        width: '100%'
    },
    inactiveButton: {
        backgroundColor: '#aaaaaa',
        paddingTop: 5,
        paddingBottom: 5,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20,
        height: 40,
        width: '100%'
    },
    submit: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        fontSize: 20,
    },
});