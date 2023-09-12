import { Redirect } from 'expo-router';
import React from 'react';
import * as Storage from "../../components/common/Storage";

export default function SignOut() {
    Storage.removeAuthDetails();

    return (
        <Redirect href="/" />
    );
}