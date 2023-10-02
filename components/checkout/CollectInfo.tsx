import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import CheckoutButton from '../common/CheckoutButton';
import ErrorText from '../common/ErrorText';
import FormKey from '../common/FormKey';
import FormValue from '../common/FormValue';

interface CollectInfoProps {
    setFirstName: (event: any) => void;
    setLastName: (event: any) => void;
    setAddress: (event: any) => void;
    setPhoneNumber: (event: any) => void;
    submitIfEnter: (event: any) => void;
    submit: () => void;
    defaultFirstName?: string;
    defaultLastName?: string;
    errorMessage?: string;
}

export default function CollectInfo(props: CollectInfoProps) {
    const {
        setFirstName,
        setLastName,
        setAddress,
        setPhoneNumber,
        submitIfEnter,
        submit,
        defaultFirstName,
        defaultLastName,
        errorMessage
    } = props;

    return (
        <View style={styles.collectInfo}>
            <Text style={styles.title}>Shipping Information</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                <View style={{ width: '45%' }}>
                    <FormKey>First Name</FormKey>
                    <FormValue onChangeText={setFirstName} onKeyPress={submitIfEnter} defaultValue={defaultFirstName}></FormValue>
                </View>
                <View style={{ width: '45%' }}>
                    <FormKey>Last Name</FormKey>
                    <FormValue onChangeText={setLastName} onKeyPress={submitIfEnter} defaultValue={defaultLastName}></FormValue>
                </View>
            </View>
            <View style={{ paddingTop: 20 }}>
                <FormKey>Shipping Address</FormKey>
                <FormValue onChangeText={setAddress} onKeyPress={submitIfEnter}></FormValue>
            </View>
            <View style={{ paddingTop: 20 }}>
                <FormKey>Phone Number</FormKey>
                <FormValue onChangeText={setPhoneNumber} onKeyPress={submitIfEnter}></FormValue>
            </View>
            <View style={{ paddingTop: 30 }}>
                {errorMessage && <ErrorText message={errorMessage} />}
                <CheckoutButton active={true} onPress={submit} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    collectInfo: {
        paddingTop: 30,
        width: Dimensions.get('window').width < 700 ? '95%' : 500,
        marginLeft: Dimensions.get('window').width < 700 ? 0 : '5%',
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 30,
        // textAlign: 'center',
        paddingTop: 10
    },
});