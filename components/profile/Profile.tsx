import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { emitEvent, getAllRewards } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";
import ResponseText from '../common/ResponseText';
import ViewPromoCode from './ViewPromoCode';
import { capitalizeFirst } from '../../constants/utils';
import { WebsiteEvent } from '../../constants/EventTypes';

function getRewardsListStyle(numRewards: number) {
    if (numRewards == 0) {
        return {
            marginLeft: 30,
            marginRight: 30,
        }
    } else {
        return {
            borderBottomWidth: 1,
            marginLeft: 30,
            marginRight: 30,
            borderColor: 'rgba(249, 166, 108, 0.5)', // rasoi box yellow with opacity
        }
    }
}

export interface PromoCode {
    promoCodeName: string,
    status: string,
    amountOff?: number,
    percentOff?: number
    orderId?: string
}

function ProfileInformation(props: {authDetails: AuthDetails | undefined}) {
    const { authDetails } = props
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.field}>
                <Text style={styles.fieldName}>NAME</Text>
                <Text style={styles.fieldValue}>{authDetails?.first_name + " " + authDetails?.last_name}</Text>
            </View>
            <View style={styles.field}>
                <Text style={styles.fieldName}>EMAIL</Text>
                <Text style={styles.fieldValue}>{authDetails?.email}</Text>
            </View>
        </View>
    )
}

function RewardsInformation(props: {authDetails: AuthDetails | undefined}) {
    const { authDetails } = props

    const [loading, setLoading] = useState<boolean>(true)
    const [rewards, setRewards] = useState<PromoCode[]>([])

    useEffect(() => {
        if (authDetails?.verification_code) {
            setLoading(true)
            getAllRewards(authDetails.verification_code).then(response => {
                const newRewards: PromoCode[] = []
                Object.values(response).map(item => {
                    let promo: PromoCode = {
                        promoCodeName: item['promo_code'],
                        status: item['status']
                    }
                    if (item['amount_off']) {
                        promo = {
                            ...promo,
                            amountOff: item['amount_off']
                        }
                    }
                    if (item['percent_off']) {
                        promo = {
                            ...promo,
                            percentOff: item['percent_off']
                        }
                    }
                    if (item['order_id']) {
                        promo = {
                            ...promo,
                            orderId: item['order_id']
                        }
                    }

                    newRewards.push(promo)
                })

                setRewards(newRewards)
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [])

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Rewards</Text>
            {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{padding: 50}}/> : 
                <View>
                    <View>
                        <View style={styles.header}>
                            <View style={styles.cell}>
                                <Text style={styles.headerValue}>Promo</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.headerValue}>Amount</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.headerValue}>Status</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text></Text>
                            </View>
                        </View>
                        <FlatList
                            data={rewards}
                            renderItem={({item}) => <ViewPromoCode promoCode={item} />}
                            style={getRewardsListStyle(rewards.length)}
                        />
                        <View style={styles.refer}>
                            <Text style={styles.referText}>
                                Get 20% off your next order by referring your friends!
                            </Text>
                            <Pressable onPress={() => window.open("/refer", "_self")}>
                                <View style={styles.button}>
                                    <Ionicons name='person-add' style={styles.menuIcon} size={15} />
                                    <Text style={styles.buttonText}>
                                        Refer a Friend
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
}

export default function Profile() {
    document.title = "Your Profile | Rasoi Box"
    const [loading, setLoading] = useState<boolean>(true)
    const [authDetails, setAuthDetails] = useState<AuthDetails | undefined>()

    useEffect(() => {
        Storage.getAuthDetails().then(response => {
            if (response != null) {
                setAuthDetails(response)
            }
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (authDetails?.verification_code) {
            emitEvent(WebsiteEvent.PROFILE, new Date(), authDetails.verification_code)
        }
    }, [authDetails])

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView>
                <Header />
                {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/> : 
                    <View style={{alignItems: 'center'}}>
                        <ProfileInformation authDetails={authDetails}/>
                        <RewardsInformation authDetails={authDetails}/>
                    </View>
                }
                <Footer />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginTop: 30,
        borderWidth: 1,
        borderColor: 'rgba(249, 166, 108, 0.5)', // rasoi box yellow with opacity
        borderRadius: 10,
        width: Dimensions.get('window').width < 700 ? '95%' : '60%',
    },
    field: {
        flexDirection: 'row'
    },
    fieldName: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingLeft: 30,
        paddingRight: Dimensions.get('window').width < 700 ? 50 : 100,
        paddingTop: 10,
        paddingBottom: 10,
    },
    fieldValue: {
        fontFamily: 'AvenirLight',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15
    },
    title: {
        fontSize: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 10,
        paddingTop: 20,
        paddingBottom: 20,
        fontFamily: 'AvenirLight',
        borderBottomWidth: 1,
        borderColor: 'rgba(249, 166, 108, 0.5)', // rasoi box yellow with opacity
    },
    clipboard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottomWidth: 1,
        marginLeft: 30,
        marginRight: 30,
        borderColor: 'rgba(249, 166, 108, 0.5)', // rasoi box yellow with opacity
    },
    cell: {
        width: '20%',
        flexDirection: 'row',
    },
    headerValue: {
        fontFamily: 'AvenirLight',
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15
    },
    refer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    referText: {
        fontFamily: 'AvenirLight',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        paddingBottom: 10,
        fontSize: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: rasoiBoxYellow,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: 'AvenirLight',
        color: 'white',
        fontSize: 15,
        paddingLeft: 10
    },
    menuIcon: {
        color: 'white'
    }
});