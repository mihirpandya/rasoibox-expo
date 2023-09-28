import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import AuthShim from "../../components/common/AuthShim";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import SignUpForm from "../../components/signup/SignUpForm";

export default function SignIn() {
    return (
        <View style={{height: '100%'}}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <Header />
            <AuthShim authChild={<Redirect href="/menu" />} unauthChild={<SignUpForm />}/>
            <Footer />
        </View>
    )
}

