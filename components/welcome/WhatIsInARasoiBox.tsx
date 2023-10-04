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
                            title="Pre-Portioned Spices" 
                            subtitle="No more buying bulk spices from specialty grocery stores, just to try a new cuisine."
                        />
                        <Repeater 
                            title="Fresh Produce and Herbs" 
                            subtitle="High quality and seasonal, sourced locally."
                        />
                        <Repeater 
                            title="Accompaniments" 
                            subtitle="Condiments. Chutneys. Pickle. Papadum."
                        />
                        <Repeater 
                            title="Step-by-Step Recipe Card" 
                            subtitle="Clear instructions and cooking tips, complete with access to a video guide."
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
        padding: 20,
        // borderWidth: 1
    },
    leftCard: {
        margin: Dimensions.get('window').width < 700 ? 10 : 40,
        paddingLeft: Dimensions.get('window').width < 700 ? 10 : 60,
        paddingRight: Dimensions.get('window').width < 700 ? 10 : 60,
        paddingTop: Dimensions.get('window').width < 700 ? 10 : 30,
        paddingBottom: Dimensions.get('window').width < 700 ? 10 : 30,
        backgroundColor: 'white',
        borderRadius: Dimensions.get('window').width < 700 ? 20 : 0
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
        flexDirection: Dimensions.get('window').width < 700 ? 'row' : 'row',
        width: Dimensions.get('window').width < 700 ? '100%' : '60%',
        padding: 20,
    },
    imageContainer: {
        paddingTop: 5
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
    }
});