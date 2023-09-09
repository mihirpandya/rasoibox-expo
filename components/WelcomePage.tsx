import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from "../components/Themed";
import Header from "./Header";
import Footer from "./Footer";
import GetStarted from "./GetStarted";
import InnerChef from "./InnerChef";
import { titleColor } from '../constants/Colors';

export default function WelcomePage() {
    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <Header />
                <View style={styles.card}>
                    <Text style={styles.slogan}>COOK WITH CONFIDENCE</Text>
                    <Text style={styles.description}>
                        Discover the joy of cooking easy, healthy, fresh and delicious Indian meals with ready-to-cook ingredients and step-by-step instructions from Rasoi Box.
                    </Text>
                    <GetStarted />
                </View>
                <InnerChef />
                <Footer />
            </ScrollView>
        </View>
      )
}

const styles = StyleSheet.create({
    card: {
        paddingLeft: '20%',
        paddingRight: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    slogan: {
        fontSize: 100,
        fontFamily: 'CormorantGaramondSemiBold',
        textAlign: 'center',
        color: titleColor
    },
    description: {
        fontSize: 25,
        fontFamily: 'AvenirLight',
        width: '50%',
        color: '#555555',
        paddingTop: 20,
    },
    button: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#f9a66c',
        fontSize: 20,
        fontFamily: 'AvenirLight',
    },
  });