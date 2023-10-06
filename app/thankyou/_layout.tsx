import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import Footer from "../../components/common/Footer"
import Header from "../../components/common/Header"
import { getOrderFromIntent } from "../api/rasoibox-backend"
import { orderJsonToOrderInformationResponse } from "../../constants/utils"
import OrderInformation, { OrderInformationResponse } from "../../components/order/OrderInformation"
import { useEffect, useState } from "react"
import { rasoiBoxPink } from "../../constants/Colors"

function OrderConfirmed(props: {
    orderId: string,
    email: string
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Thank you!
            </Text>
            <Text style={styles.subtitle}>
                Your Order #{props.orderId} has been successfully confirmed!
            </Text>
            <Text style={styles.message}>
                We're getting started on your order right away, and you will receive a confirmation email and receipt shortly to {props.email}.
            </Text>
        </View>
    )
}

function NotFound() {
    return (
        <View style={styles.card}>
            <Text style={styles.subtitle}>
                Order not found.
            </Text>
        </View>
    )
}

export default function ThanksForYourOrder() {
    document.title = "Order Confirmed | Rasoi Box"
    const parsedUrl: URL = new URL(location.href)
    const orderId: string | null = parsedUrl.searchParams.get('order_id')
    const paymentIntent: string | null = parsedUrl.searchParams.get('payment_intent')

    const [orderInfo, setOrderInfo] = useState<OrderInformationResponse | undefined>()
    const [loading, setLoading] = useState<boolean>(true);

    function fetchOrderInformation() {
        if (!orderId || !paymentIntent) {
            setLoading(false);
            return;
        }

        getOrderFromIntent(orderId, paymentIntent).then(response => {
            const orderResponse = orderJsonToOrderInformationResponse(response)
            if (orderResponse != undefined) {
                setOrderInfo(orderResponse)
            }
        }).catch(error => {
            setOrderInfo(undefined)
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchOrderInformation()
    }, [])

    return (
        <View>
            <Header />
            {
                loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50, backgroundColor: 'white'}}/> :
                    orderInfo ?
                        <OrderConfirmed orderId={orderInfo.orderNumber} email={orderInfo.customerEmail} /> :
                        <NotFound />
            }
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 80,
        paddingBottom: 30
    },
    subtitle: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 30,
        paddingBottom: 10,
    },
    message: {
        fontFamily: 'AvenirLight',
        fontSize: 20,
        width: '60%',
        textAlign: 'center'
    }
});