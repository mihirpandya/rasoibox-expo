import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxGrey } from '../../constants/Colors';
import { ellipsify } from '../../constants/utils';

export interface CartItemResponse {
    recipeName: string,
    imageUrl: string,
    servingSize: number,
    price: number,
    recipeId: number
}

export default function CartItem(props: { 
    cartItem: CartItemResponse, 
    children?: React.ReactNode
}) {
    const { cartItem, children } = props;
    return (
        <View style={styles.cartItem}>
            <Image style={styles.itemImage} source={{ uri: cartItem.imageUrl }}/>
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{cartItem.recipeName.length > 18 ? ellipsify(cartItem.recipeName, 15) : cartItem.recipeName}</Text>
                <Text style={styles.servingSize}>{cartItem.servingSize} servings</Text>
                <Text style={styles.price}>{cartItem.price}</Text>
            </View>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        padding: 20,
    },
    itemImage: {
        width: 100,
        height: 70,
        borderRadius: 10
    },
    recipeInfo: {
        paddingLeft: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: 150
    },
    recipeName: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
    },
    servingSize: {
        fontFamily: 'AvenirLight',
        fontSize: 14
    },
    price: {
        fontFamily: 'AvenirLight',
        fontSize: 14,
        flexDirection: 'row-reverse',
    },
    deleteItem: {
        justifyContent: 'center',
        left: 40
    },
});