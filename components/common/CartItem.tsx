import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { rasoiBoxGrey } from '../../constants/Colors';

export interface CartItemResponse {
    recipeName: string,
    imageUrl: string,
    servingSize: number,
    price: number
}

function ellipsify(name: string): string {
    return name.substring(0, 15) + "..."
}

export default function CartItem(props: { cartItem: CartItemResponse, deleteItem: () => void }) {
    const { cartItem, deleteItem } = props;
    return (
        <View style={styles.cartItem}>
            <Image style={styles.itemImage} source={{ uri: cartItem.imageUrl }}/>
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{cartItem.recipeName.length > 18 ? ellipsify(cartItem.recipeName) : cartItem.recipeName}</Text>
                <Text style={styles.servingSize}>{cartItem.servingSize} servings</Text>
                <Text style={styles.price}>{cartItem.price}</Text>
            </View>
            <View style={styles.deleteItem}>
                <Pressable onPress={deleteItem}>
                    <Ionicons name="trash-outline" size={20} color={rasoiBoxGrey} />
                </Pressable>
            </View>
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