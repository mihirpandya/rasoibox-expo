import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import AuthShim from "../../components/common/AuthShim";
import Header from "../../components/common/Header";
import SignInForm from "../../components/signin/SignInForm";

export default function SignIn() {
    return (
        <View style={{height: '100%'}}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <Header />
            <AuthShim authChild={<Redirect href="/menu" />} unauthChild={<SignInForm />}/>
        </View>
    )
}

