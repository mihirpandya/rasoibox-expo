import { router } from 'expo-router';
import React, { RefObject } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxGrey, rasoiBoxYellow, titleColor } from '../../constants/Colors';

function getSloganFontSize(): number {
    const width = Dimensions.get('window').width;
    if (width < 700) {
        return 40;
    } else {
        return 100;
    }
}

function getDescriptionFontSize(): number {
    const width = Dimensions.get('window').width;
    if (width < 700) {
        return 19;
    } else {
        return 25;
    }
}

export default function CookWithConfidence(props: {
    scrollView: RefObject<ScrollView>,
    coordinate: number
}) {
    const { scrollView, coordinate } = props;

    return (
        <View style={styles.card}>
            <Text style={styles.slogan}>COOK WITH CONFIDENCE</Text>
            <Text style={styles.description}>
                Discover the joy of cooking easy, healthy, fresh and delicious Indian meals with ready-to-cook ingredients and "bite-sized" instructions from Rasoi Box.
            </Text>
            <View style={styles.buttons}>
                <Pressable onPress={() => {
                    if (scrollView.current) {
                        scrollView.current.scrollTo({
                            x: 0,
                            y: coordinate
                        })
                    }
                }}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            Get Started
                        </Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => router.replace("/menu")}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            View Menu
                        </Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingLeft: Dimensions.get('screen').width < 700 ? '10%' : '20%',
        paddingRight: Dimensions.get('screen').width < 700 ? '10%' : '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: '3%'
    },
    slogan: {
        fontSize: getSloganFontSize(),
        fontFamily: 'CormorantGaramondSemiBold',
        textAlign: 'center',
        color: titleColor,
        paddingTop: 20
    },
    description: {
        fontSize: getDescriptionFontSize(),
        fontFamily: 'AvenirLight',
        width: Dimensions.get('screen').width < 700 ? '100%' : '50%',
        color: rasoiBoxGrey,
        paddingTop: 30,
        paddingBottom: 20
    },
    buttons: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 50,
    },
    button: {
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20,
        height: 40,
        width: 130,
    },
    buttonText: {
        fontFamily: 'AvenirLight',
        color: 'white',
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5
    }
});