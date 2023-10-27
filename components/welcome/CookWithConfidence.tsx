import React, { RefObject } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
            {Dimensions.get('window').width >= 1000 &&
                <View style={{flex: 1, height: '100%', width: '100%'}}>
                    <Image style={styles.chanaMasala} source={require('../../assets/images/cover/chanamasala.png')}/>
                    <Image style={styles.tofuBhurji} source={require('../../assets/images/cover/tofubhurji.png')}/>
                    <Image style={styles.besanChilla} source={require('../../assets/images/cover/besanchilla.png')}/>
                    <Image style={styles.paneerButterMasala} source={require('../../assets/images/cover/paneerbuttermasala.png')}/>
                    <Image style={styles.paneerSaag} source={require('../../assets/images/cover/paneersaag.png')}/>
                </View>
            }
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
                <Pressable onPress={() => window.open("/menu", "_self")}>
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
    },
    chanaMasala: {
        width: 300,
        height: 300,
        position: 'fixed',
        top: 350,
        left: 90
    },
    tofuBhurji: {
        width: 200,
        height: 200,
        position: 'fixed',
        top: 100,
        left: 60
    },
    besanChilla: {
        width: 200,
        height: 200,
        position: 'fixed',
        top: 550,
        right: 50
    },
    paneerButterMasala: {
        width: 300,
        height: 300,
        position: 'fixed',
        top: 90,
        right: 100
    },
    paneerSaag: {
        width: 150,
        height: 150,
        position: 'fixed',
        top: 420,
        right: 300
    }
});