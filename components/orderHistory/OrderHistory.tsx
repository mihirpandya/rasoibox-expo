import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getOrderHistory } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { cleanDate, getTotal, orderJsonToOrderInformationResponse, twoDecimals } from '../../constants/utils';
import * as Storage from "../common/Storage";
import { OrderInformationResponse } from '../order/OrderInformation';

function goToOrder(orderNumber: string) {
    router.replace("/order/" + orderNumber);
}

interface IndexedOrderInformation {
    orderInfo: OrderInformationResponse,
    isEven: boolean
}

function getOrderSummaryStyle(grey: boolean) {
    return grey ? styles.greyOrderSummary : styles.whiteOrderSummary
}

function OrderSummary(props: {orderInfo: IndexedOrderInformation}) {
    const { orderInfo, isEven } = props.orderInfo
    
    return (
        <View style={getOrderSummaryStyle(isEven)}>
            <View style={{width: '50%'}}>
                <Text style={styles.info}>Order #{orderInfo.orderNumber}</Text>
                <Text style={styles.info}>Ordered on: {cleanDate(orderInfo.orderDate)}</Text>
                <Text style={styles.info}>Total: {twoDecimals(getTotal(orderInfo))}</Text>
            </View>
            <View style={{width: '30%'}}>
                <Text style={styles.info}>{orderInfo.delivered ? "Delivered" : "Delivery Pending"}</Text>
            </View>
            <Pressable onPress={() => goToOrder(orderInfo.orderNumber)}>
                <View style={styles.button}>
                    {Dimensions.get('window').width >= 700 && <Text style={styles.viewDetails}>View Details</Text>}
                    <Entypo name="chevron-small-right" size={22} color={rasoiBoxYellow} />
                </View>
            </Pressable>
        </View>
    )
}

export default function OrderHistory() {
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
            getOrderHistory(authtoken).then(response => {
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

    const orderInfos: IndexedOrderInformation[] = Object.keys(orderHistory)
        .map(idx => {
            const index: number = Number(idx)
            return {
                orderInfo: orderHistory[index],
                isEven: (index % 2) == 0
            }
        })
    
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <Header />
                <View style={styles.card}>
                    <Text style={styles.title}>Order History</Text>
                {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/> : 
                    <FlatList
                        data={orderInfos}
                        renderItem={
                            ({item}) => <OrderSummary orderInfo={item} />
                        }/>
                    }
                </View>
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingLeft: Dimensions.get('window').width < 700 ? 0 : '20%',
        paddingRight: Dimensions.get('window').width < 700 ? 0 : '20%'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 30,
        paddingTop: 10,
        paddingLeft: 20,
    },
    whiteOrderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: Dimensions.get('window').width < 700 ? 0 : 20,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10
    },
    greyOrderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: Dimensions.get('window').width < 700 ? 0 : 20,
        backgroundColor: '#eeeeee',
        paddingTop: 10,
        paddingBottom: 10
    },
    info: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        fontFamily: 'AvenirLight',
        fontSize: 15,
    },
    button: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    viewDetails: {
        fontFamily: 'AvenirLight',
        color: rasoiBoxYellow,
        fontWeight: 'bold',
        fontSize: 15
    }
});