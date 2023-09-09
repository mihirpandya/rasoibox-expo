import React, { useEffect, useState } from 'react';
import { Text } from '../../components/Themed';
import { getAvailableItems } from '../api/rasoibox-backend';
import { View } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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