import React from 'react';
import { View } from 'react-native';
import { Text } from '../../components/Themed';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';

export default function OurStory() {
    
    return (
        <View>
            <Header />

            <Text>
                This is our story.
            </Text>

            <Footer />
        </View>
    );
}