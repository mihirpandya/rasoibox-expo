import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '../../components/Themed';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { getAvailableItems } from '../api/rasoibox-backend';

export default function Menu() {
    const [availableItems, setAvailableItems] = useState()

    const fetchAvailableItems = () => {
        getAvailableItems().then(response => {
            setAvailableItems(response)
        })
    }

    useEffect(() => {
        fetchAvailableItems()
      }, [])
    
    return (
        <View>
            <Header />

            <Text>
                {JSON.stringify(availableItems)}
            </Text>

            <Footer />
        </View>
    );
}