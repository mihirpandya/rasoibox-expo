import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { canFinishCooking, finishCooking } from '../../app/api/rasoibox-backend';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import * as Storage from "../common/Storage";



function FinishCooking(props: { token?: string, orderNumber?: string | null, recipeId?: number}) {

    const { token, orderNumber, recipeId } = props;

    const [isConfetti, setIsConfetti] = useState<boolean>(false)
    const [finishedCooking, setFinishedCooking] = useState<boolean>(false)

    async function pressFinishCooking() {
        setIsConfetti(true)
        setFinishedCooking(true)
        setTimeout(() => setIsConfetti(false), 3000)
        if (token && orderNumber && recipeId && orderNumber != null) {
            await finishCooking(token, recipeId, orderNumber, new Date()).then(_response => {
            }).catch(e => {
                console.error(e)
            })
        }
    }

    return (
        <View style={styles.finishCooking}>
            <View style={finishedCooking ? styles.finishCookingButtonDisabled : styles.finishCookingButton}>
                <Pressable style={{flexDirection: 'row'}} onPress={pressFinishCooking} disabled={finishedCooking}>
                    <MaterialCommunityIcons name="silverware-clean" size={25} color="white" />
                    <Text style={styles.finishCookingText}>
                        {finishedCooking ? "Bon Appetit!": "Finish Cooking"}
                    </Text>
                </Pressable>
            </View>
            {
                isConfetti && <ConfettiExplosion />
            }
        </View>
    )
}

export default function RecipeConclusion(props: { recipeId: number }) {
    const { recipeId } = props;
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
            canFinishCooking(token, recipeId, orderId).then(response => {
                console.log(response)
                if (response['can_finish_cooking'] == true) {
                    setShowFinishCooking(true)
                }
            }).catch(_e => {
                setShowFinishCooking(false)
            })
        }
    }, [token])

    return (
        <View>
            <FinishCooking token={token} orderNumber={orderId} recipeId={recipeId}/>
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
    },
    finishCooking: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        paddingBottom: 30
    },
    finishCookingButton: {
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20
    },
    finishCookingButtonDisabled: {
        backgroundColor: rasoiBoxPink,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20
    },
    finishCookingText: {
        color: 'white',
        fontFamily: 'AvenirLight',
        fontSize: 20,
        paddingLeft: 5
    },
})