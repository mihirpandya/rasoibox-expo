import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getActiveRecipes } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { borderGrey, rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { cleanDate, orderJsonToOrderInformationResponse } from '../../constants/utils';
import * as Storage from "../common/Storage";
import { OrderInformationResponse } from '../order/OrderInformation';

interface OrderRecipeInfo {
    orderNumber: string,
    orderDate: Date,
    recipeId: number,
    recipeName: string,
    servingSize: number,
    imageUrl: string
}

function CookItem(props: { recipe: OrderRecipeInfo }) {
    const { recipe } = props;
    const recipeRoute = "/recipe/" + recipe.recipeId + "/" + recipe.servingSize
    return (
        <Pressable onPress={() => router.replace(recipeRoute)}>
            <View style={styles.recipeCard}>
                <Image style={styles.recipeImage} source={{uri: recipe.imageUrl}} />
                <View style={styles.recipeDetails}>
                    <Text style={styles.recipeName}>{recipe.recipeName}</Text>
                    <Text style={styles.servings}>{recipe.servingSize + " servings"}</Text>
                    <Text style={styles.orderDate}>Ordered on: {cleanDate(recipe.orderDate)}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default function ViewStartCooking() {
    const [authtoken, setAuthToken] = useState<string | undefined>()
    const [orderHistory, setOrderHistory] = useState<OrderInformationResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    function fetchToken() {
        AsyncStorage.getItem(Storage.ACCESS_TOKEN).then(async token => {
            if (token != null) {
                setAuthToken(token);
            }
        }).catch(error => {
            console.error(error);
        });
    }

    function fetchOrderHistory() {
        if (authtoken) {
            getActiveRecipes(authtoken).then(response => {
                const orderInformations: OrderInformationResponse[] = Object.values(response)
                    .map(item => orderJsonToOrderInformationResponse(item))
                    .filter(item => item != undefined)
                
                if (orderInformations.length > 0) {
                    setOrderHistory(orderInformations)
                }

                setLoading(false)
            })
        }
    }

    useEffect(() => {
        fetchToken()
      }, []);

    useEffect(() => {
        fetchOrderHistory()
    }, [authtoken])

    const recipeInfos: OrderRecipeInfo[] = []
    if (orderHistory && orderHistory.length > 0) {
        orderHistory.sort((o1, o2) => o1.orderDate > o2.orderDate ? -1 : 1)
            .forEach(order => {
                Object.entries(order.recipes).forEach(entry => {
                    console.log(entry);
                    recipeInfos.push({
                        orderNumber: order.orderNumber,
                        orderDate: order.orderDate,
                        recipeName: entry[0],
                        recipeId: entry[1].id,
                        servingSize: entry[1].servingSize,
                        imageUrl: entry[1].imageUrl
                    })
                })
            })
    }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView>
                <Header />
                    {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/> :
                    (recipeInfos.length > 0) ? 
                        <View style={styles.card}>
                            <Text style={styles.title}>What are you cooking today?</Text>
                            <FlatList 
                                data={recipeInfos}
                                renderItem={({item}) => <CookItem key={item.orderNumber + item.recipeName} recipe={item} />}
                            />
                        </View> :
                        <View style={styles.card}>
                            <Text style={styles.subtitle}>You have no active orders. Click below to view our menu and start cooking today.</Text>
                            <Pressable onPress={() => {router.replace('/menu')}}>
                                <View style={styles.button}>
                                    <Text style={styles.viewMenu}>
                                        View Menu
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    }
                <Footer />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingLeft: Dimensions.get('window').width < 700 ? 0 : '20%',
        paddingRight: Dimensions.get('window').width < 700 ? 0 : '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingTop: 20,
        paddingBottom: 30,
    },
    subtitle: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        paddingTop: 100,
        paddingBottom: 50,
    },
    button: {
        backgroundColor: rasoiBoxYellow,
        padding: 10,
        borderRadius: 20,
        width: 175,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewMenu: {
        fontFamily: 'AvenirLight', 
        color: 'white',
        fontSize: 15
    },
    recipeCard: {
        borderBottomWidth: 1,
        borderColor: borderGrey,
        padding: 20,
        width: Dimensions.get('window').width < 700 ? '95%': 500,
        flexDirection: 'row'
    },
    recipeImage: {
        width: 120,
        height: 84,
        borderRadius: 10
    },
    recipeName: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 20,
        paddingBottom: 5
    },
    recipeDetails: {
        paddingLeft: 15
    },
    servings: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        color: rasoiBoxGrey
    },
    orderDate: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        fontStyle: 'italic',
        color: rasoiBoxGrey
    }
});