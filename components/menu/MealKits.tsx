import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { emitEvent, getAvailableItems } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import MealKitCard from "../../components/menu/MealKitCard";
import MealKitModal from "../../components/menu/MealKitModal";
import { rasoiBoxPink } from '../../constants/Colors';
import { WebsiteEvent } from '../../constants/EventTypes';
import { generateCode } from '../../constants/utils';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";

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
    tags: string[],
    createdBy: string
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
                await Storage.storeAuthDetails(newAuthDetails).finally(() => {
                    setAuthDetails(newAuthDetails)
                    setUpdateCart(true)
                })
            } else if (authDetails) {
                setAuthDetails(authDetails)
                setUpdateCart(true)
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
                    tags: values[i]['tags'],
                    createdBy: values[i]['created_by']
                })
            }
            items.reverse()
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
            const parsedUrl: URL = new URL(location.href)
            const referrer: string | null = parsedUrl.searchParams.get('ref')
            emitEvent(WebsiteEvent.MENU_PRICES, new Date(), authDetails.verification_code, referrer)
        }
    }, [authDetails])

    const selectItem = (mealKit: MealKit) => {
        setSelectedItem(mealKit)
    }
    
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView>
                <Header updateCart={updateCart} setUpdateCart={setUpdateCart} />
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
                            createdBy={item.createdBy}
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
                            createdBy={selectedItem.createdBy}
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
        paddingLeft: Dimensions.get('window').width < 700 ? '0%' : '10%',
        paddingRight: Dimensions.get('window').width < 700 ? '0%' : '10%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItem: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: '3%'
    }
})