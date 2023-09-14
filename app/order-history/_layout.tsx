import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/Themed';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';

export default function OrderHistory() {
    
    return (
        <View>
            <Header />

            <Text>
                This is your order history.
            </Text>

            <Footer />
        </View>
    );
}