import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import * as Storage from "../common/Storage";

export default function OrderInformation(props: {orderNumber: any}) {
    const { orderNumber } = props;

    const [authtoken, setAuthToken] = useState<string | undefined>()

    function fetchToken() {
        AsyncStorage.getItem(Storage.ACCESS_TOKEN).then(async token => {
            if (token != null) {
                setAuthToken(token);
            }
        }).catch(error => {
            console.error(error);
        });
    }

    useEffect(() => {
        fetchToken()
      }, [])

    return (
        <View>
            <Header />
            <View style={styles.card}>
                <Text>Order number: {orderNumber} </Text>
            </View>
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingLeft: '10%',
        paddingRight: '10%'
    },
});