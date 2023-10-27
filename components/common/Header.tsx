import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getCart } from '../../app/api/rasoibox-backend';
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import LeftMenu from "../LeftMenu";
import RightCart from "../cart/RightCart";
import { AuthDetails } from './AuthShim';
import { CartItemResponse } from './CartItem';
import Lightbox, { LightboxSide } from "./Lightbox";
import * as Storage from "./Storage";
import { Octicons } from '@expo/vector-icons';


function LogoTitle() {
    const imageUrl = Dimensions.get('window').width < 700 ? require('../../assets/images/icon.png') : 
        require('../../assets/images/header_logo.svg')
    return (
        <Link href="/">
          <Image
            style={styles.logo}
            source={imageUrl}
          />
        </Link>
    );
}

function HeaderContent(props: {
    authDetails: AuthDetails | undefined,
    menuPressed: boolean,
    cartPressed: boolean,
    cartLoading: boolean,
    cart: CartItemResponse[],
    cartSize: number,
    hideStartCooking: boolean,
    fetchCart: () => void,
    toggleMenuPressed: () => void,
    toggleCartPressed: () => void,
}) {
    const {
        authDetails,
        menuPressed,
        cartPressed,
        cartLoading,
        cart,
        cartSize,
        hideStartCooking,
        fetchCart,
        toggleMenuPressed,
        toggleCartPressed
    } = props
    return (
        <View>
            <View style={styles.header}>
                <View style={styles.left}>
                    <Pressable onPress={toggleMenuPressed} style={styles.menu}>
                        <Ionicons name="menu-sharp" size={25} color={rasoiBoxGrey}/>
                    </Pressable>
                    <Lightbox isVisible={menuPressed} width={300} side={LightboxSide.left} closeLightbox={toggleMenuPressed}>
                        <LeftMenu authDetails={authDetails} onNav={toggleMenuPressed}/>
                    </Lightbox>
                    <LogoTitle />
                </View>
                <View style={styles.right}>
                    {!hideStartCooking && 
                    <View style={styles.startCooking}>
                        <Pressable style={{flexDirection: 'row'}} onPress={() => window.open("/startcooking", "_self")}>
                            <MaterialCommunityIcons name="silverware-clean" size={20} color="white" />
                            <Text style={styles.startCookingText}>
                                Start Cooking
                            </Text>
                        </Pressable>
                    </View>}
                    <Pressable style={styles.cart} onPress={toggleCartPressed}>
                        <Ionicons name="cart-outline" size={25} color={rasoiBoxPink}/>
                        {cartSize > 0 && 
                            <View style={styles.cartSize}>
                                <Text style={styles.cartSizeText}> {cartSize} </Text>
                            </View>
                        }
                    </Pressable>
                </View>
                <Lightbox isVisible={cartPressed} width={350} side={LightboxSide.right} closeLightbox={toggleCartPressed}>
                    <RightCart loading={cartLoading} cart={cart} closeLightbox={toggleCartPressed} fetchCart={fetchCart}/>
                </Lightbox>
            </View>
        </View>
    )
}


export default function Header(props: {
    hideStartCooking?: boolean
    updateCart?: boolean
    setUpdateCart?: (update: boolean) => void
}) {
    const { updateCart, hideStartCooking, setUpdateCart } = props;
    const [authDetails, setAuthDetails] = useState<AuthDetails>();
    const [menuPressed, setMenuPressed] = useState<boolean>(false);
    const [cartPressed, setCartPressed] = useState<boolean>(false);
    const [cartSize, setCartSize] = useState<number>(0)
    const [cartLoading, setCartLoading] = useState<boolean>(true);
    const [cart, setCart] = useState<CartItemResponse[]>([])

    const toggleMenuPressed = () => {
        console.log(menuPressed)
        const newPressed = !menuPressed;
        setMenuPressed(newPressed);
    }

    const toggleCartPressed = () => {
        const newPressed = !cartPressed;
        setCartPressed(newPressed);
    }

    function fetchCart() {
        if (authDetails?.verification_code != undefined) {
            setCartLoading(true);
            getCart(authDetails.verification_code).then(response => {
                const cartItems: CartItemResponse[] = Object.values(response).map(item => {
                    return {
                        recipeName: item["recipe_name"],
                        imageUrl: item["image_url"],
                        servingSize: item["serving_size"],
                        price: item["price"]
                    }
                });

                setCart(cartItems);
                setCartSize(cartItems.length)
                setCartLoading(false);
            })
        }
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
    }, [updateCart])

    useEffect(() => {
        fetchCart()
    }, [authDetails])

    useEffect(() => {
        if (setUpdateCart && updateCart) {
            fetchCart()
            setUpdateCart(false)
        }
    }, [updateCart])

    return (
        <View>
            <Stack.Screen options={{
                headerShown: true,
                header: (_props) => {
                    return (
                        <HeaderContent 
                            authDetails={authDetails}
                            menuPressed={menuPressed}
                            cartPressed={cartPressed}
                            cartLoading={cartLoading}
                            cart={cart}
                            cartSize={cartSize}
                            hideStartCooking={!!hideStartCooking}
                            fetchCart={fetchCart}
                            toggleMenuPressed={toggleMenuPressed}
                            toggleCartPressed={toggleCartPressed}
                        />
                    )
                },
                title: "Rasoi Box"
            }} />
            <View style={styles.ribbon}>
                <Text style={styles.ribbonTextLarge}>
                    $5 on orders $40+ | $10 on orders $60+ | $20 on orders $80+
                </Text>
                <Text style={styles.ribbonTextSmall}>limited time only. promo auto-applied at check-out.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: Dimensions.get('window').width < 700 ? 30 : 150,
        height: Dimensions.get('window').width < 700 ? 30 : 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: 'white',
        height: 70,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0'
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '5%'
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: '5%',
    },
    startCooking: {
        backgroundColor: rasoiBoxYellow,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20
    },
    startCookingText: {
        color: 'white',
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingLeft: 5
    },
    ribbon: {
        backgroundColor: '#fde4d2',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ribbonTextSmall: {
        paddingTop: 3,
        fontSize: Dimensions.get('window').width < 700 ? 10 : 12,
        fontFamily: 'CormorantGaramondSemiBold',
    },
    ribbonTextLarge: {
        fontSize: Dimensions.get('window').width < 700 ? 15 : 20,
        fontFamily: 'CormorantGaramondSemiBold',
    },
    ribbonText: {
        color: 'white',
        fontFamily: 'AvenirLight',
        fontSize: Dimensions.get('window').width < 700 ? 12 : 15
    },
    // icons
    menu: {
        marginRight: 5
    },
    cart: {
        marginLeft: 5
    },
    cartSize: {
        backgroundColor: rasoiBoxYellow,
        marginTop: -10,
        marginLeft: 15,
        borderRadius: 10,
        width: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartSizeText: {
        textAlign: 'center',
        fontSize: 10,
        color: 'white',
        fontFamily: 'AvenirLight',
        fontWeight: 'bold',
    }
});