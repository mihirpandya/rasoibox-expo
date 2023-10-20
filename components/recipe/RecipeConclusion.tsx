import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import * as Storage from "../common/Storage";
import { AuthDetails } from '../common/AuthShim';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrder } from '../../app/api/rasoibox-backend';

export default function RecipeConclusion() {
    const parsedUrl: URL = new URL(location.href)
    const orderId: string | null = parsedUrl.searchParams.get('order_id')

    const [token, setToken] = useState<string>()
    const [showFinishCooking, setShowFinishCooking] = useState<boolean>(false)

    useEffect(() => {
        AsyncStorage.getItem(Storage.ACCESS_TOKEN).then(token => {
            if (token != null) {
                setToken(token)
            }
        })
    }, [])

    useEffect(() => {
        if (token && orderId) {
            getOrder(token, orderId).then(_response => {
                setShowFinishCooking(true)
            })
        }
    }, [token])

    return (
        <View>
            <Text style={styles.title}>
                How did it go?
            </Text>
            <Text style={styles.message}>
                Let us know how it turned out! Write us at hello@rasoibox.com and tag @rasoiboxinc on Instagram.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        color: rasoiBoxPink,
        fontSize: 25,
        paddingBottom: 10,
    },
    message: {
        fontFamily: 'AvenirLight',
        fontSize: 17
    }
})