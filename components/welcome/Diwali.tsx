import { Dimensions, View, StyleSheet, Text, Image, Pressable } from "react-native";
import { rasoiBoxPink, rasoiBoxYellow } from "../../constants/Colors";
import { Ionicons } from '@expo/vector-icons';

function DiwaliCollection() {
    return (
        <View style={styles.diwaliCollection}>
            <Text style={styles.dateText}>
                30 Oct - 15 Nov
            </Text>
            <Text style={styles.diwaliText}>
                Diwali
            </Text>
            <Text style={styles.collectionText}>
                C O L L E C T I O N
            </Text>
        </View>
    )
}

export default function Diwali() {
    return (
        <View style={styles.card}>
            <View style={styles.top}>
                <Image style={styles.toran} source={require('../../assets/images/toran.png')} resizeMode="repeat"/>
            </View>
            <View style={styles.banner}>
                {Dimensions.get('window').width < 700 && <DiwaliCollection />}
                <View style={styles.left}>
                    <Image style={styles.lamps} source={require('../../assets/images/lamps.png')} />
                </View>
                <View style={styles.right}>
                    {Dimensions.get('window').width >= 700 && <DiwaliCollection />}
                    <View style={styles.diwaliCollection}>
                        <Pressable onPress={() => {window.open("/menu", "_self")}}>
                            <View style={styles.shopNowButton}>
                                <Text style={styles.shopNowText}>
                                    SHOP NOW
                                </Text>
                            </View>
                        </Pressable>
                        <View style={styles.logos}>
                            <Image style={styles.rb} source={require('../../assets/images/header_logo.svg')} />
                            <Ionicons style={styles.rbxsc} name="close" size={24} color={rasoiBoxYellow} />
                            <Image style={styles.sc} source={require('../../assets/images/sc_horz.png')} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
    },
    banner: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column': 'row',
    },
    top: {
        marginTop: Dimensions.get('window').width < 700 ? -5 : -10,
    },
    toran: {
        width: Dimensions.get('window').width < 700 ? '100%' : '100%',
        height: Dimensions.get('window').width < 700 ? 50 : 101
    },
    lamps: {
        width: Dimensions.get('window').width < 700 ? 300 : 620,
        height: Dimensions.get('window').width < 700 ? 160 : 330
    },
    left: {
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Dimensions.get('window').width < 700 ? 0 : 50,
        paddingBottom: 50,
        paddingLeft: Dimensions.get('window').width < 700 ? '0%' : '10%',
    },
    right: {
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
        paddingRight: Dimensions.get('window').width < 700 ? '0%' : '10%',
    },
    diwaliCollection: {
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    diwaliText: {
        fontFamily: 'Amita',
        fontSize: Dimensions.get('window').width < 700 ? 70 : 100,
        color: '#ffc94b',
    },
    dateText: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: Dimensions.get('window').width < 700 ? 25 : 30,
        color: rasoiBoxPink,
        top: 25,
    },
    collectionText: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: Dimensions.get('window').width < 700 ? 25 : 30,
        color: rasoiBoxPink,
        bottom: Dimensions.get('window').width < 700 ? 25 : 40
    },
    shopNowButton: {
        backgroundColor: rasoiBoxYellow,
        borderRadius: 20,
    },
    shopNowText: {
        fontFamily: 'AvenirLight',
        color: 'white',
        fontSize: 20,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 5,
        paddingBottom: 5
    },
    logos: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        marginTop: 30,
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rb: {
        width: Dimensions.get('window').width < 700 ? 150 : 150,
        height: 30,
    },
    sc: {
        width: Dimensions.get('window').width < 700 ? 250 : 250,
        height: 40
    },
    rbxsc: {
        paddingTop: Dimensions.get('window').width < 700 ? 15 : 0,
        paddingLeft: Dimensions.get('window').width < 700 ? 0 : 15,
    }
});