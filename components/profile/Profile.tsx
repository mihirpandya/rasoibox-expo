import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxPink } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";

function ProfileInformation(props: {authDetails: AuthDetails | undefined}) {
    const { authDetails } = props
    return (
        <View style={styles.card}>
            <Text style={styles.text}>Name: {authDetails?.first_name + " " + authDetails?.last_name}</Text>
            <Text style={styles.text}>Email: {authDetails?.email}</Text>
        </View>
    )
}

export default function Profile() {
    const [loading, setLoading] = useState<boolean>(true)
    const [authDetails, setAuthDetails] = useState<AuthDetails | undefined>()

    useEffect(() => {
        Storage.getAuthDetails().then(response => {
            if (response != null) {
                setAuthDetails(response)
            }
            setLoading(false)
        })
    })

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <Header />
            {loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingTop: 50}}/> : 
                <ProfileInformation authDetails={authDetails}/>
            }
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingLeft: Dimensions.get('window').width < 700 ? 0 : '20%',
        paddingRight: Dimensions.get('window').width < 700 ? 0 : '20%',
        marginTop: 30,
    },
    text: {
        fontFamily: 'AvenirLight',
        padding: 20,
        fontSize: 17
    }
});