import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxYellow } from '../../constants/Colors';

export default function OurStory() {
    
    return (
        <View style={styles.body}>
            <ScrollView>
                <Header />

                <View style={styles.contents}>
                    <View style={styles.first}>
                        <Image style={styles.image} source={require('../../assets/images/mihshim.png')} />
                        <View style={styles.ourstory}>
                            <Text style={styles.title}>Our Story</Text>
                            <Text style={styles.story}>
                                We are Mihir and Shimul, the husband-wife team behind Rasoi Box.
                                Growing up, we had a deep appreciation for our moms' homecooked Indian meals.
                                Mihir, having traveled extensively, missed the taste of home and sought a way to recreate it.
                                Shimul, on the other hand, was spoiled by her mom's cooking, but found Indian cuisine intimidating to prepare on her own.
                            </Text>
                        </View>
                    </View>
                    <View style={styles.second}>
                        <Image style={styles.image} source={require('../../assets/images/rasoi_definition.png')} />
                        <View style={styles.mission}>
                            <Text style={styles.title}>Our Mission</Text>
                            <Text style={styles.missionText}>
                                With Rasoi Box, we aim to bring those same everyday Indian meals to your kitchen.
                                Our goal is to empower people to explore rich flavors and culinary traditions of India 
                                through convenient meal kits and easy-to-follow recipes, beyond what you might commonly find in restaurants.
                            </Text>
                        </View>
                    </View>
                </View>

                <Footer />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
    },
    contents: {
        marginTop: 30,
        marginLeft: '15%',
        marginRight: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    first: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column-reverse' : 'row',
        justifyContent: 'space-between'
    },
    second: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row-reverse',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    title: {
        color: rasoiBoxYellow,
        fontSize: 30,
        fontFamily: 'CormorantGaramondSemiBold',
        paddingBottom: 30,
    },
    ourstory: {
        width: '100%',
        justifyContent: 'center',
        paddingLeft: Dimensions.get('window').width < 700 ? 10 : 50,
        marginBottom: Dimensions.get('window').width < 700 ? 50 : 0
    },
    story: {
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
        fontFamily: 'AvenirLight',
        fontSize: 18,
        lineHeight: 35,
    },
    image: {
        width: Dimensions.get('window').width < 700 ? Dimensions.get('window').width - 10 : 400,
        height: 500,
        borderRadius: 20,
    },
    mission: {
        width: Dimensions.get('window').width < 700 ? '100%' : '70%',
        justifyContent: 'center',
        paddingLeft: Dimensions.get('window').width < 700 ? 10 : 50,
        paddingTop: Dimensions.get('window').width < 700 ? 30 : 0
    },
    missionText: {
        width: '100%',
        fontFamily: 'AvenirLight',
        fontSize: 18,
        lineHeight: 35,
    }
});