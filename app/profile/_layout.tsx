import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/Themed';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';

export default function Profile() {
    
    return (
        <View>
            <Header />

            <Text>
                This is your profile.
            </Text>

            <Footer />
        </View>
    );
}