import React, { useState } from 'react';
import { Stack, Link } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import Header from "../../components/Header";
import { rasoiBoxYellow } from '../../constants/Colors';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function onPress() {
    }

    return (
        <View style={{height: '100%'}}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <Header />
            <View style={styles.center}>
                <View style={styles.card}>
                    <View style={styles.form}>
                        <Text style={styles.title}>
                            Welcome Back!
                        </Text>
                        <Text style={styles.fieldTitle}>
                            Email
                        </Text>
                        <TextInput style={styles.fieldValue} />
                        <View style={styles.password}>
                            <Text style={styles.fieldTitle}>
                                Password
                            </Text>
                            <Link href="/forgotpassword">
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </Link>
                        </View>
                        <TextInput style={styles.fieldValue} secureTextEntry={true}/>
                        <Pressable style={styles.button} onPress={onPress}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </Pressable>
                        <View style={styles.signup}>
                            <Text style={styles.signupText}>New to Rasoi Box?</Text>
                            <Link href="/signup">
                                <Text style={styles.forgotPassword}>Sign Up</Text>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 500,
        width: 485,
        borderRadius: 10,
        boxShadow: '2px 2px 20px 2px rgba(0, 0, 0, 0.2)',
    },
    center: {
        alignItems: 'center',
        height: '100%',
        paddingTop: 50,
        backgroundColor: 'white'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 50
    },
    fieldTitle: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        paddingBottom: 20,
    },
    fieldValue: {
        height: 30,
        borderBottomWidth: 1,
        padding: 7,
        paddingLeft: 20,
        fontFamily: 'AvenirLight',
        fontSize: 15,
    },
    password: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 30
    },
    forgotPassword: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        color: rasoiBoxYellow,
        textDecorationLine: 'underline'
    },
    form: {
        padding: 50
    },
    button: {
        marginTop: 30,
        width: '100%',
        height: 40,
        backgroundColor: rasoiBoxYellow,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: 'AvenirLight',
        color: 'white',
        fontSize: 17,
    },
    signup: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20
    },
    signupText: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingRight: 5,
    }
});
