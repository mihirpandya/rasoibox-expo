import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import Modal from "react-native-modal";
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { AuthDetails } from './AuthShim';
import * as Storage from "./Storage";

function LogoTitle() {
    return (
        <Link href="/">
          <Image
            style={styles.logo}
            source={require('../../assets/images/header_logo.svg')}
          />
        </Link>
    );
}

function MenuItem(props: {name: any, iconName: any, href: any}) {
    return (
        <Pressable onPress={() => router.replace(props.href)}>
            <View style={styles.menuItem}>
                <Ionicons name={props.iconName} style={styles.menuIcon} size={25} />
                <Text style={styles.menuText}>{props.name}</Text>
            </View>
        </Pressable>
    )
}


export default function Header() {
    const [authDetails, setAuthDetails] = useState<AuthDetails>();
    const [pressed, setPressed] = useState<boolean>(false);

    const togglePressed = () => {
        const newPressed = !pressed;
        setPressed(newPressed);
    }

    useEffect(() => {
        Storage.getAuthDetails().then(stored => {
            if (stored == undefined) {
                stored = {
                    authenticated: false
                }
            }
            setAuthDetails(stored);
        })
    }, [])

    return (
        <View style={styles.header}>
            <Stack.Screen options={{
                headerShown: false,
                title: "Rasoi Box"
            }} />
            <Pressable onPress={togglePressed}>
                <Ionicons style={styles.menu} name="menu" size={25} />
            </Pressable>
            <Modal 
                isVisible={pressed}
                onBackdropPress={togglePressed}
                animationIn={'slideInLeft'}
                animationOut={'slideOutLeft'}
                backdropOpacity={0.0}
            >
                <View style={styles.modalView}>
                    <Pressable onPress={togglePressed}>
                        <AntDesign name="close" style={styles.close} size={25} />
                    </Pressable>
                    <FlatList
                        data={[
                            {'key': 'Sign In', 'icon': 'person-circle-outline', 'href': '/signin'},
                            {'key': 'Menu', 'icon': 'fast-food', 'href': '/menu'},
                            {'key': 'Our Story', 'icon': 'compass-outline', 'href': '/our-story'},
                            {'key': 'Blog', 'icon': 'book', 'href': '/blog'},
                            {'key': 'Refer a Friend', 'icon': 'person-add', 'href': '/refer-a-friend'},
                        ]}
                        renderItem={({item}) => <MenuItem name={item.key} iconName={item.icon} href={item.href}/>}
                    />
                </View>
            </Modal>
            <LogoTitle />
            {authDetails?.authenticated && <AntDesign style={styles.cart} name="shoppingcart" size={25} />}
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 50
    },
    header: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContent: {
        padding: 30,
        backgroundColor: 'white',
        width: 200,
        borderRadius: 10,
    },
    modalView: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        position: 'fixed',
        marginLeft: -80,
        width: 400,
        height: Dimensions.get('window').height + 10,
    },
    menuItem: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        textAlign: 'left',
    },
    menuText: {
        fontSize: 20,
        fontFamily: 'AvenirLight',
        padding: 20
    },
    // icons
    menu: {
        position: 'fixed',
        left: '10%',
        color: '#555555',
    },
    cart: {
        position: 'fixed',
        right: '10%',
        color: rasoiBoxPink
    },
    close: {
        color: '#555555',
        padding: 20,
        borderBottomWidth: 1,
    },
    menuIcon: {
        padding: 20,
        color: rasoiBoxYellow,
    }
});