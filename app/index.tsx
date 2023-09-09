import { View, Image, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Text } from "../components/Themed";

function LogoTitle() {
    return (
        <Link href="/">
          <Image
            style={styles.logo}
            source={{ uri: '../assets/images/header_logo.svg' }}
          />
        </Link>
    );
}

function FooterIcon() {
    return (
        <Image 
            style={styles.icon}
            source={{uri: '../assets/images/icon.png' }}
        />
    )
}

export default function WelcomePage() {
    return (
        <View>
            <View style={styles.header}>
                <Stack.Screen options={{
                    headerShown: false,
                    title: "Rasoi Box"
                }} />
                <LogoTitle />
            </View>
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
            <View style={styles.footer}>
                <FooterIcon />
                <Text>hello@rasoibox.com</Text>
                <br />
                <Text>Rasoi Box, Inc.</Text>
            </View>
        </View>
      )
}

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    },
    logo: {
        width: 200,
        height: 50
    },
    footer: {
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'     
    },
    body: {
        backgroundColor: 'white',
        paddingTop: 150,
        paddingBottom: 100,
        paddingLeft: '20%',
        paddingRight: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slogan: {
        fontSize: 50,
        fontFamily: 'CormorantGaramondSemiBold',
    },
    header: {
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center' 
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