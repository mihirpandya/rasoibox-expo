import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import MealKitCard from "../../components/menu/MealKitCard";
import MealKitModal from "../../components/menu/MealKitModal";
import { getAvailableItems } from '../api/rasoibox-backend';

interface MealKit {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    servingSizes: number[],
    prices: number[],
    cookTime: number,
    prepTime: number,
    tags: string[]
}

export default function Menu() {
    const [availableItems, setAvailableItems] = useState<MealKit[]>([])
    const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);

    const fetchAvailableItems = () => {
        getAvailableItems().then(response => {
            const keys = Object.keys(response);
            const values = Object.values(response);
            const items: MealKit[] = []
            for (let i = 0; i < keys.length; i++) {
                items.push({
                    id: keys[i],
                    name: values[i]['recipe_name'],
                    description: values[i]['description'],
                    imageUrl: values[i]['image_url'],
                    servingSizes: values[i]['serving_sizes'],
                    prices: values[i]['prices'],
                    cookTime: values[i]['cook_time'],
                    prepTime: values[i]['prep_time'],
                    tags: values[i]['tags']
                })
            }
            setAvailableItems(items)
        })
    }

    useEffect(() => {
        fetchAvailableItems()
      }, []);

    const selectItemId = (id: number) => {
        setSelectedItemId(id)
    }

    const selectedItem: MealKit | undefined = (selectedItemId == undefined) ? undefined : availableItems.filter(mealKit => mealKit.id === selectedItemId)[0]
    
    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <Header />
                    <View style={styles.card}>
                        {availableItems.map(item => <MealKitCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            imageUrl={item.imageUrl}
                            servingSizes={item.servingSizes}
                            prices={item.prices}
                            cookTime={item.cookTime}
                            prepTime={item.prepTime}
                            tags={item.tags}
                            onPress={() => selectItemId(item.id)}
                        />)}
                        {selectedItem != undefined && <MealKitModal 
                            isVisible={selectedItemId != undefined}
                            closeModal={() => setSelectedItemId(undefined)}
                            id={selectedItem.id}
                            name={selectedItem.name}
                            description={selectedItem.description}
                            imageUrl={selectedItem.imageUrl}
                            servingSizes={selectedItem.servingSizes}
                            prices={selectedItem.prices}
                            cookTime={selectedItem.cookTime}
                            prepTime={selectedItem.prepTime}
                            tags={selectedItem.tags}
                        />}
                    </View>
                <Footer />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingLeft: '10%',
        paddingRight: '10%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItem: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    }
})