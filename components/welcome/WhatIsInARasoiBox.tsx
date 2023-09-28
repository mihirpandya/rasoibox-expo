import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';

function Repeater(props: {
    title: string,
    subtitle: string,
}) {
    const {title, subtitle} = props

    return (
        <View style={styles.repeater}>
            <View style={styles.imageContainer}>
                <Feather name="check-circle" size={24} color={rasoiBoxPink} />
            </View>
            <View style={styles.repeaterContent}>
                <Text style={styles.repeaterTitle}>
                    {title}
                </Text>
                <Text style={styles.repeaterSubtitle}>
                    {subtitle}
                </Text>
            </View>
        </View>
    )
}

export default function WhatIsInARasoiBox() {
    return (
        <View style={styles.card}>
            <View style={styles.left}>
                <View style={styles.leftCard}>
                    <Text style={styles.whatsInARasoiBox}>
                        What's in a Rasoi Box?
                    </Text>
                    <View style={styles.repeaters}>
                        <Repeater 
                            title="Personalize your Plate" 
                            subtitle="Is prepared food too spicy or salty? Let our meal kits and your tastebuds guide you in the kitchen."
                        />
                        <Repeater 
                            title="Flexible Selections" 
                            subtitle="Date night, family dinner, or group fun. Order what you want, when you want. No subscriptions, no commitments. "
                        />
                        <Repeater 
                            title="Rotational Menu" 
                            subtitle="Explore unique dishes not usually found in restaurants, every week. "
                        />
                    </View>
                </View>
            </View>
            <View style={styles.right}>
                <Image style={styles.rasoiBoxImage} source={require('../../assets/images/rasoibox_box.png')} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: rasoiBoxYellow,
        flexDirection: Dimensions.get('window').width < 700 ? 'column-reverse' : 'row',
        marginTop: 30,
    },
    left: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width < 700 ? '100%' : '60%',
    },
    whatsInARasoiBox: {
        fontSize: Dimensions.get('window').width < 700 ? 30 : 56,
        fontFamily: 'CormorantGaramondSemiBold',
        textAlign: 'center',
        padding: 20
    },
    leftCard: {
        margin: Dimensions.get('window').width < 700 ? 10 : 40,
        backgroundColor: 'white',
    },
    right: {
        width: Dimensions.get('window').width < 700 ? '100%' : '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rasoiBoxImage: {
        width: Dimensions.get('window').width < 700 ? 280 : 540,
        height: Dimensions.get('window').width < 700 ? 235 : 440,
    },
    repeaters: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    repeater: {
        // height: Dimensions.get('window').width < 700 ? 250 : 150,
        flexDirection: Dimensions.get('window').width < 700 ? 'row' : 'row',
        width: Dimensions.get('window').width < 700 ? '100%' : '60%',
        padding: 20,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    repeaterContent: {
        justifyContent: Dimensions.get('window').width < 700 ? 'flex-start' : 'center',
        paddingLeft: Dimensions.get('window').width < 700 ? 10 : 30,
        flex: 1,
        flexWrap: 'wrap',
    },
    repeaterTitle: {
        fontFamily: 'AvenirLight',
        fontWeight: 'bold',
        fontSize: 20,
    },
    repeaterSubtitle: {
        fontFamily: 'AvenirLight',
        fontSize: 14,
        paddingTop: 10,
    }
});