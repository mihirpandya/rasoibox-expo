import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';

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
            <View style={styles.left}>
                <Text style={styles.innerChef}>
                    Unleash your Inner Chef
                </Text>
            </View>
            <View style={styles.right}>
                <Repeater 
                    title="Personalize your Plate" 
                    subtitle="Is prepared food too spicy or salty? Let our meal kits and your tastebuds guide you in the kitchen."
                    image={require("../../assets/images/personalize_plate.svg")}
                />
                <Repeater 
                    title="Flexible Selections" 
                    subtitle="Date night, family dinner, or group fun. Order what you want, when you want. No subscriptions, no commitments. "
                    image={require("../../assets/images/flexible_selections.svg")}
                />
                <Repeater 
                    title="Rotational Menu" 
                    subtitle="Explore unique dishes not usually found in restaurants, every week. "
                    image={require("../../assets/images/rotational_menu.svg")}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: rasoiBoxPink,
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    left: {
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
        paddingTop: Dimensions.get('window').width < 700 ? 30 : 100,
        paddingBottom: Dimensions.get('window').width < 700 ? 30 : 100,
        paddingLeft: Dimensions.get('window').width < 700 ? 5 : 100,
        paddingRight: Dimensions.get('window').width < 700 ? 5 : 100,
    },
    innerChef: {
        fontSize: Dimensions.get('window').width < 700 ? 35 : 75,
        fontFamily: 'CormorantGaramondSemiBold',
        color: 'white',
        textAlign: 'center'
    },
    right: {
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
        fontSize: 25,
        fontFamily: 'AvenirLight'
    },
    repeater: {
        height: Dimensions.get('window').width < 700 ? 250 : 150,
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        width: Dimensions.get('window').width < 700 ? '100%' : '90%',
    },
    repeaterImage: {
        height: 100,
        width: 100,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    repeaterContent: {
        justifyContent: 'center',
        paddingLeft: Dimensions.get('window').width < 700 ? 0 : 30,
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: Dimensions.get('window').width < 700 ? 'row' : 'column',
    },
    repeaterTitle: {
        fontFamily: 'AvenirLight',
        fontSize: 25,
        color: 'white'
    },
    repeaterSubtitle: {
        fontFamily: 'AvenirLight',
        fontSize: 18,
        color: 'white',
        padding: 10,
    }
});