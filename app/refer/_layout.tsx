import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '../../components/Themed';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import ReferAFriend from '../../components/refer/ReferAFriend';

export default function Refer() {
    
    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <Header />

                <ReferAFriend />

                <Footer />
            </ScrollView>
        </View>
    );
}