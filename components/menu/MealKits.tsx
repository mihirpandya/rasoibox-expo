import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { emitEvent, getAvailableItems } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import MealKitCard from "../../components/menu/MealKitCard";
import MealKitModal from "../../components/menu/MealKitModal";
import { rasoiBoxPink } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";
import { WebsiteEvent } from '../../constants/EventTypes';
import { generateCode } from '../../constants/utils';

interface MealKit {
    id: number,
    name: string,
    description: string,
    longDescription: string,
    imageUrl: string,
    servingSizes: number[],
    prices: number[],
    cookTime: number,
    prepTime: number,
    tags: string[]
}

export default function MealKits() {
    const [availableItems, setAvailableItems] = useState<MealKit[]>([])
    const [selectedItem, setSelectedItem] = useState<MealKit | undefined>(undefined);
    const [authDetails, setAuthDetails] = useState<AuthDetails | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [updateCart, setUpdateCart] = useState<boolean>(false)
    
    function storeVerificationCode() {
        Storage.getAuthDetails().then(async authDetails => {
            let code: string | undefined = authDetails?.verification_code
            if (!code) {
                code = generateCode()
                let newAuthDetails: AuthDetails
                if (authDetails) {
                    newAuthDetails = {
                        ...authDetails,
                        verification_code: code
                    }
                } else {
                    newAuthDetails = {
                        authenticated: false,
                        verification_code: code
                    }
                }
                await Storage.storeAuthDetails(newAuthDetails).finally(() => setAuthDetails(newAuthDetails))
            }
        })
    }

    useEffect(() => {
        storeVerificationCode()
    }, [])

    const fetchAvailableItems = () => {
        setLoading(true);
        getAvailableItems().then(response => {
            const keys = Object.keys(response);
            const values = Object.values(response);
            const items: MealKit[] = []
            console.log(response);
            for (let i = 0; i < keys.length; i++) {
                items.push({
                    id: keys[i],
                    name: values[i]['recipe_name'],
                    description: values[i]['description'],
                    longDescription: values[i]['long_description'],
                    imageUrl: values[i]['image_url'],
                    servingSizes: values[i]['serving_sizes'],
                    prices: values[i]['prices'],
                    cookTime: values[i]['cook_time'],
                    prepTime: values[i]['prep_time'],
                    tags: values[i]['tags']
                })
            }
            setAvailableItems(items)
            setLoading(false);
        })
    }

    const fetchAuthDetails = () => {
        Storage.getAuthDetails().then(details => {
            if (details != null) {
                setAuthDetails(details)
            }
        }).catch(error => {
            console.error(error);
        })
    }

    const closeModal = () => {
        setSelectedItem(undefined);
        setUpdateCart(true)
    }

    useEffect(() => {
        fetchAvailableItems()
      }, []);

    useEffect(() => {
        fetchAuthDetails()
    }, [])

    useEffect(() => {
        if (authDetails?.verification_code) {
            emitEvent(WebsiteEvent.MENU_PRICES, new Date(), authDetails.verification_code)
        }
    }, [authDetails])

    const selectItem = (mealKit: MealKit) => {
        setSelectedItem(mealKit)
    }
    
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView>
                <Header updateCart={updateCart} setUpdateCart={setUpdateCart}/>
                {
                    loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/> :
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
                            onPress={() => selectItem(item)}
                        />)}
                        {selectedItem != undefined && <MealKitModal 
                            isVisible={selectedItem != undefined}
                            closeModal={closeModal}
                            id={selectedItem.id}
                            name={selectedItem.name}
                            description={selectedItem.longDescription}
                            imageUrl={selectedItem.imageUrl}
                            servingSizes={selectedItem.servingSizes}
                            prices={selectedItem.prices}
                            cookTime={selectedItem.cookTime}
                            prepTime={selectedItem.prepTime}
                            tags={selectedItem.tags}
                            verificationCode={authDetails?.verification_code}
                        />}
                    </View>
                }
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
        paddingTop: '3%'
    }
})