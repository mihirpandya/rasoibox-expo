import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxYellow } from '../../constants/Colors';

function Repeater(props: {
    title: string,
    subtitle: string,
    image: any
}) {
    const {title, subtitle, image} = props

    return (
        <View style={styles.repeater}>
            <View style={styles.imageContainer}>
                <Image style={styles.repeaterImage} source={image}/>
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

export default function InnerChef() {
    return (
        <View style={styles.card}>
            <Text style={styles.howItWorks}>
                How it Works
            </Text>
            <View style={styles.repeaters}>
                <Repeater 
                    title="1. Choose your Meal Kits"
                    subtitle="Explore unique dishes not usually found in restaurants, every week."
                    image={require("../../assets/images/choose_meal_kits.svg")}
                />
                <Repeater 
                    title="2. Receive your Meals"
                    subtitle="Your kits will be delivered with all the pre-measured ingredients."
                    image={require("../../assets/images/receive_meals.svg")}
                />
                <Repeater 
                    title="3. Cook your meal"
                    subtitle="You can refer to our step-by-step video guides for additional help while cooking."
                    image={require("../../assets/images/cook_meals.svg")}
                />
                <Repeater 
                    title="4. Bon Appetit!"
                    subtitle="Enjoy your meal, all from the comfort of your own home."
                    image={require("../../assets/images/bon_appetit.svg")}
                />
                <Repeater 
                    title="5. Cook. Earn. Enjoy!"
                    subtitle="Build your cooking streak, unlock rewards, and embrace the joy of cooking."
                    image={require("../../assets/images/enjoy.svg")}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    howItWorks: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: Dimensions.get('window').width < 700 ? 35 : 56,
        padding: 40,
    },
    repeaters: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row'
    },
    repeater: {
        flexDirection: 'column',
        width: Dimensions.get('window').width < 700 ? '100%' : '20%'
    },
    repeaterImage: {
        height: 100,
        width: 100,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    repeaterContent: {
        justifyContent: 'center',
        paddingLeft: Dimensions.get('window').width < 700 ? 20 : 30,
        paddingRight: Dimensions.get('window').width < 700 ? 20 : 30,
        flexWrap: 'wrap',
    },
    repeaterTitle: {
        fontFamily: 'AvenirLight',
        fontSize: 20,
        color: rasoiBoxYellow,
        paddingBottom: 10,
    },
    repeaterSubtitle: {
        fontFamily: 'AvenirLight',
        fontSize: 16,
    }
});