import React, { useEffect, useState } from 'react';
import { Text } from '../../components/Themed';
import { getAvailableItems } from '../api/rasoibox-backend';
import { View } from 'react-native';

export default function Menu() {
    const [availableItems, setAvailableItems] = useState([])

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
            <Text>
            {JSON.stringify(availableItems)}
            </Text>
        </View>
    );
}