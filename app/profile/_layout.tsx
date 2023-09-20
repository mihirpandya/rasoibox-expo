import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/Themed';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import AuthShim from '../../components/common/AuthShim';
import { Redirect } from 'expo-router';
import Profile from '../../components/profile/Profile'

export default function ViewProfile() {
    
    return (
        <AuthShim authChild={<Profile />} unauthChild={<Redirect href="/" />} />
    );
}