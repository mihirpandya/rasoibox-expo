import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import ForgotPasswordForm from '../../components/forgotpassword/ForgotPasswordForm';

export default function ForgotPassword() {
    return (
        <View style={{height: '100%'}}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <Header />
            <ForgotPasswordForm />
            <Footer />
        </View>
    )
}

