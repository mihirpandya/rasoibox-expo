import { useEffect, useState } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Footer from "../../components/common/Footer"
import Header from "../../components/common/Header"
import { OrderInformationResponse } from "../../components/order/OrderInformation"
import { rasoiBoxPink, rasoiBoxYellow } from "../../constants/Colors"
import { orderJsonToOrderInformationResponse } from "../../constants/utils"
import { getOrderFromIntent } from "../api/rasoibox-backend"

function OrderConfirmed(props: {
    orderId: string,
    createId: number,
    email: string
    paymentIntent: string
}) {
    const { orderId, createId, email, paymentIntent } = props;
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Thank you!
            </Text>
            <Text style={styles.subtitle}>
                Your Order #{orderId} has been successfully confirmed!
            </Text>
            <Text style={styles.message}>
                We're getting started on your order right away, and you will receive a confirmation email and receipt shortly to {email}.
            </Text>
            <Pressable onPress={() => {window.open("/createpassword?create_id=" + createId + "&payment_intent=" + paymentIntent, "_self")}}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>
                        Create Account Password
                    </Text>
                </View>
            </Pressable>
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
        <View style={{flex: 1}}>
            <ScrollView>
                <Header />
                {
                    loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{ paddingTop: 50, backgroundColor: 'white' }} /> :
                        orderInfo && paymentIntent ?
                            <OrderConfirmed 
                                orderId={orderInfo.orderNumber} 
                                createId={orderInfo.createId} 
                                email={orderInfo.customerEmail} 
                                paymentIntent={paymentIntent}
                            /> :
                            <NotFound />
                }
                <Footer />
            </ScrollView>
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
        textAlign: 'center',
        paddingBottom: 20
    },
    button: {
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20,
        height: 40
    },
    buttonText: {
        fontFamily: 'AvenirLight',
        color: 'white',
        fontSize: 15,
    }
});