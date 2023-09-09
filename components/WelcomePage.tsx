import { View, Image, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Text } from "../components/Themed";
import Header from "./Header";
import Footer from "./Footer";

export default function WelcomePage() {
    return (
        <View>
            <Header />

            <View style={styles.body}>
                <Text style={styles.slogan}>COOK WITH CONFIDENCE</Text>
                <Link href="/menu">
                    <Pressable style={styles.button}>
                        <Text>
                            View Menu
                        </Text>
                    </Pressable>
                </Link>
            </View>
            
            <Footer />
        </View>
      )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 100,
        paddingLeft: '20%',
        paddingRight: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slogan: {
        fontSize: 40,
        fontFamily: 'CormorantGaramondSemiBold',
        textAlign: 'center',
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