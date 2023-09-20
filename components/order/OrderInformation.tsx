import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import * as Storage from "../common/Storage";
import { getOrder } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink } from '../../constants/Colors';
import CartItem, { CartItemResponse } from '../common/CartItem';
import PriceInformation from '../common/PriceInformation';
import { ScrollView } from 'react-native-gesture-handler';
import { PromoCode } from '../checkout/Checkout';
import { totalAfterPromo } from '../../constants/utils';


interface OrderBreakdown {
    items: Record<string, number>,
    promoCodes: PromoCode[]
}

interface RecipeInfo {
    id: number,
    imageUrl: string,
    servingSize: number,
    price: number
}

interface DeliveryAddress {
    city: string,
    state: string,
    zipcode: string,
    userInput: string,
    streetName: string,
    streetNumber: number,
    apartmentNumber: string
}

interface OrderInformationResponse {
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

function cleanDate(date: Date): string {
	let tzDate = new Date()
	tzDate.setUTCDate(date.getDate())
	tzDate.setUTCMonth(date.getMonth())
	tzDate.setUTCFullYear(date.getFullYear())
	tzDate.setUTCHours(date.getHours())
	tzDate.setUTCMinutes(date.getMinutes())
	tzDate.setUTCSeconds(date.getSeconds())
	tzDate.setUTCMilliseconds(date.getMilliseconds())
	return (tzDate).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"})
}

function cleanAddress(address: DeliveryAddress): string {
    let addressStr: string = ""
    if (address.streetNumber > 0) {
        addressStr += address.streetNumber
    }
    addressStr += " "
    addressStr += address.streetName
    addressStr += ", "
    if (address.apartmentNumber != undefined && address.apartmentNumber.length > 0) {
        addressStr += address.apartmentNumber
        addressStr += ", "
    }
    addressStr += address.city
    addressStr += ", "
    addressStr += address.state
    addressStr += " "
    addressStr += address.zipcode

    return addressStr
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
            price: recipe[1].price
        }
    })
}

function getSubtotal(orderInfo: OrderInformationResponse | undefined): number | undefined {
    if (orderInfo == undefined) {
        return undefined
    }

    let total = 0
    Object.values(orderInfo.recipes).forEach(recipe => total += recipe.price)
    return total
}

function getTotal(orderInfo: OrderInformationResponse | undefined): number | undefined {
    if (orderInfo == undefined) {
        return undefined
    }

    let total = getSubtotal(orderInfo)
    const promoCodes: PromoCode[] = orderInfo.orderBreakdown.promoCodes
    if (total != undefined && promoCodes != undefined && promoCodes.length > 0) {
        return totalAfterPromo(total, promoCodes[0])
    } else {
        return total
    }
}


export default function OrderInformation(props: {orderNumber: any}) {
    const { orderNumber } = props;

    const [authtoken, setAuthToken] = useState<string | undefined>()
    const [orderInfo, setOrderInfo] = useState<OrderInformationResponse>()
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true);

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
            const items: {[itemId: string] : number} = response['order_breakdown']['items'];
            const promoCodes: PromoCode[] = Object.values(response['order_breakdown']['promo_codes']).map(code => {
                return {
                    name: code['name'],
                    amountOff: code['amount_off'],
                    percentOff: code['percent_off'],
                }
            })
            const orderBreakdown: OrderBreakdown = {
                items: items,
                promoCodes: promoCodes
            }
            const deliveryAddress = {
                city: response['order_delivery_address']['city'],
                state: response['order_delivery_address']['state'],
                zipcode: response['order_delivery_address']['zipcode'],
                userInput: response['order_delivery_address']['user_input'],
                streetName: response['order_delivery_address']['street_name'],
                streetNumber: response['order_delivery_address']['street_number'],
                apartmentNumber: response['order_delivery_address']['apartment_number']
            }
            const recipes: { [recipeName: string] : RecipeInfo } = Object.fromEntries(
                Object.entries(response['recipes']).map(entry => [entry[0], {
                    id: entry[1]['id'],
                    imageUrl: entry[1]['image_url'],
                    servingSize: entry[1]['serving_size'],
                    price: entry[1]['price']
                }])
            );

            const orderResponse: OrderInformationResponse = {
                orderNumber: response['order_number'],
                orderBreakdown: orderBreakdown,
                orderDate: new Date(response['order_date']),
                recipientName: response['order_recipient_name'],
                deliveryAddress: deliveryAddress,
                totalDollars: response['order_total_dollars'],
                delivered: response['order_delivered'],
                customerEmail: response['customer_email'],
                recipes: recipes
            }

            setOrderInfo(orderResponse)
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
                                    ({item}) => <CartItem cartItem={item} hideDelete={true} deleteItem={() => {}}/>
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
        flexDirection: Dimensions.get('window').width < 700 ? 'column-reverse': 'row',
        justifyContent: 'space-evenly'
    },
    orderNumber: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: Dimensions.get('window').width < 700 ? 20 : 30,
    },
    orderSummary: {
        paddingTop: 30
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
        paddingTop: 20
    },
    content: {
        fontFamily: 'AvenirLight',
        fontSize: Dimensions.get('window').width < 700 ? 12 : 15,
    },
    orderDetails: {

    },
    summary: {
        paddingTop: 30,
        width: Dimensions.get('window').width < 700 ? '95%' : 380,
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : 0,
        marginTop: Dimensions.get('window').width < 700 ? 20 : 0,
        borderRadius: 10,
        borderWidth: 1
    },
});