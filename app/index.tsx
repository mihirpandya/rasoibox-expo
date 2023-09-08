import React, { useEffect, useState } from 'react';
import { Text } from '../components/Themed';
import { getAvailableItems } from './api/rasoibox-backend';

export default function WelcomePage() {
    const [availableItems, setAvailableItems] = useState([])

    const fetchAvailableItems = () => {
        getAvailableItems().then(response => {
            console.log(response);
            setAvailableItems(response)
        })
    }

    useEffect(() => {
        fetchAvailableItems()
      }, [])
    
    return (<Text>
        {JSON.stringify(availableItems)}
    </Text>);
}