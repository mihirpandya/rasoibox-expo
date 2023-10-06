import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { emitEvent, getOrder } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { cleanAddress, cleanDate, getSubtotal, getTotal, orderJsonToOrderInformationResponse } from '../../constants/utils';
import { PromoCode } from '../checkout/Checkout';
import CartItem, { CartItemResponse } from '../common/CartItem';
import PriceInformation from '../common/PriceInformation';
import * as Storage from "../common/Storage";
import { AuthDetails } from '../common/AuthShim';
import { WebsiteEvent } from '../../constants/EventTypes';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


export interface OrderBreakdown {
    items: Record<string, number>,
    promoCodes: PromoCode[]
}

export interface RecipeInfo {
    id: number,
    imageUrl: string,
    servingSize: number,
    price: number
}

export interface DeliveryAddress {
    city: string,
    state: string,
    zipcode: string,
    userInput: string,
    streetName: string,
    streetNumber: number,
    apartmentNumber: string
}

export interface OrderInformationResponse {
    orderNumber: string,
    orderBreakdown: OrderBreakdown,
    orderDate: Date,
    recipientName: string,
    deliveryAddress: DeliveryAddress,
    totalDollars: number,
    delivered: boolean,
    recipes: { [recipeName: string] : RecipeInfo }
    customerEmail: string
}

function getCartFromOrderInfo(orderInfo: OrderInformationResponse | undefined): CartItemResponse[] {
    if (orderInfo == undefined) {
        return []
    }

    return Object.entries(orderInfo.recipes).map(recipe => {
        return {
            recipeName: recipe[0],
            imageUrl: recipe[1].imageUrl,
            servingSize: recipe[1].servingSize,
            price: recipe[1].price,
            recipeId: recipe[1].id
        }
    })
}

export default function OrderInformation(props: {orderNumber: any}) {
    const { orderNumber } = props;

    const [authtoken, setAuthToken] = useState<string | undefined>()
    const [orderInfo, setOrderInfo] = useState<OrderInformationResponse>()
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();

    function fetchToken() {
        AsyncStorage.getItem(Storage.ACCESS_TOKEN).then(async token => {
            if (token != null) {
                setAuthToken(token);
            }
        }).catch(error => {
            console.error(error);
        });
    }

    function fetchOrderInformation() {
        if (!authtoken) {
            return;
        }

        getOrder(authtoken, orderNumber).then(response => {
            const orderResponse = orderJsonToOrderInformationResponse(response)
            if (orderResponse != undefined) {
                setOrderInfo(orderResponse)
            }
        }).catch(error => {
            setError('order-not-found')
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchToken()
      }, []);

    useEffect(() => {
        fetchOrderInformation()
    }, [authtoken])

    useEffect(() => {
        Storage.getAuthDetails().then((authDetails: AuthDetails | null) => {
            if (authDetails?.verification_code) {
                emitEvent(WebsiteEvent.ORDER_INFO, new Date(), authDetails?.verification_code, orderNumber)
            }
        })
    }, [orderInfo])

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView>
                <Header />
                {loading && (orderInfo == undefined) ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50, backgroundColor: 'white'}}/> :
                    <View style={styles.card}>
                        <View style={styles.orderDetails}>
                            <View style={styles.orderSummary}>
                                <Text style={styles.title}>Order #{orderInfo?.orderNumber}</Text>
                            </View>
                            <Text style={styles.subtitle}>Order Date</Text>
                            <Text style={styles.content}>{cleanDate(orderInfo?.orderDate)}</Text>
                            <Text style={styles.subtitle}>Contact Information</Text>
                            <Text style={styles.content}>{orderInfo?.recipientName}</Text>
                            <Text style={styles.content}>{orderInfo?.customerEmail}</Text>
                            <Text style={styles.subtitle}>Shipping Address</Text>
                            <Text style={styles.content}>{cleanAddress(orderInfo?.deliveryAddress)}</Text>
                            <Text style={styles.subtitle}>Delivery Status</Text>
                            <Text style={styles.content}>{orderInfo?.delivered ? "Delivered" : "Delivery Pending"}</Text>
                        </View>
                        <View style={styles.summary}>
                            <View style={{marginLeft: 20}}>
                                <Text style={styles.title}>Order Summary</Text>
                            </View>
                            <FlatList
                                data={getCartFromOrderInfo(orderInfo)}
                                renderItem={
                                    ({item}) => <CartItem cartItem={item}>
                                                    {/* <View style={styles.infoButton}>
                                                        <Pressable onPress={() => router.replace("/recipe/" + item.recipeId + "/" + item.servingSize)}>
                                                            <Ionicons name="arrow-forward-circle-outline" size={24} color={rasoiBoxYellow} />
                                                        </Pressable>
                                                    </View> */}
                                                </CartItem>
                                }/>
                            <PriceInformation 
                                appliedPromoCode={orderInfo?.orderBreakdown.promoCodes[0]}
                                subtotal={getSubtotal(orderInfo)}
                                total={getTotal(orderInfo)}
                                showDelete={false}
                            />
                        </View>
                    </View>
                }
                <Footer />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingLeft: Dimensions.get('window').width < 700 ? '5%' : '15%',
        paddingRight: Dimensions.get('window').width < 700 ? '5%' : '15%',
    },
    card: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column': 'row',
        justifyContent: 'space-evenly'
    },
    orderNumber: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: Dimensions.get('window').width < 700 ? 20 : 30,
    },
    orderSummary: {
        paddingTop: 30,
        marginLeft: 20,
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 20,
        paddingTop: 10,
    },
    subtitle: {
        fontFamily: 'AvenirLight',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').width < 700 ? 15 :20,
        paddingTop: 20,
        marginLeft: 20,
    },
    content: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        marginLeft: 20,
    },
    orderDetails: {
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : 0,
    },
    summary: {
        paddingTop: 30,
        width: Dimensions.get('window').width < 700 ? '95%' : 380,
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : 0,
        marginTop: Dimensions.get('window').width < 700 ? 20 : 0,
        borderRadius: 10,
        borderWidth: 1
    },
    infoButton: {
        justifyContent: 'center',
        left: 40
    },
});