import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { rasoiBoxGrey, rasoiBoxPink } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";

function ProfileInformation(props: {authDetails: AuthDetails | undefined}) {
    const { authDetails } = props
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.field}>
                <Text style={styles.fieldName}>NAME</Text>
                <Text style={styles.fieldValue}>{authDetails?.first_name + " " + authDetails?.last_name}</Text>
            </View>
            <View style={styles.field}>
                <Text style={styles.fieldName}>EMAIL</Text>
                <Text style={styles.fieldValue}>{authDetails?.email}</Text>
            </View>
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
                <View style={{alignItems: 'center'}}>
                    <ProfileInformation authDetails={authDetails}/>
                </View>
            }
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginTop: 30,
        borderWidth: 1,
        borderColor: 'rgba(249, 166, 108, 0.5)', // rasoi box yellow with opacity
        borderRadius: 10,
        width: Dimensions.get('window').width < 700 ? '95%' : '60%',
    },
    field: {
        flexDirection: 'row'
    },
    fieldName: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingLeft: 30,
        paddingRight: 100,
        paddingTop: 10,
        paddingBottom: 10,
    },
    fieldValue: {
        fontFamily: 'AvenirLight',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15
    },
    title: {
        fontSize: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 10,
        paddingTop: 20,
        paddingBottom: 20,
        fontFamily: 'AvenirLight',
        borderBottomWidth: 1,
        borderColor: 'rgba(249, 166, 108, 0.5)', // rasoi box yellow with opacity
    }
});