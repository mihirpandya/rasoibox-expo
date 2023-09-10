import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
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
            <SignInForm />
        </View>
    )
}

