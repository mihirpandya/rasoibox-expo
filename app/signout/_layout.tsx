import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import * as Storage from "../../components/common/Storage";

export default function SignOut() {
    Storage.removeAuthDetails();

    return (
        <View>
            <Redirect href="/" />
        </View>
    );
}