import { AntDesign } from '@expo/vector-icons';
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from "react-native-modal";
import { rasoiBoxGrey } from "../../constants/Colors";

interface MealKitModalProps {
    isVisible: boolean,
    closeModal: () => void,
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    servingSizes: number[],
    prices: number[],
    cookTime: number,
    prepTime: number,
    tags: string[],
}

export default function MealKitModal(props: MealKitModalProps) {
    const { 
        isVisible,
        closeModal,
        id,
        name,
        description,
        imageUrl,
        servingSizes,
        prices,
        cookTime,
        prepTime,
        tags
    } = props;
    return (
        <Modal isVisible={isVisible} style={styles.modal} animationIn={'fadeIn'} animationOut={'fadeOut'} onBackdropPress={closeModal}>
            <View style={styles.modalView}>
                <Pressable>
                    <AntDesign name="close" style={styles.close} size={25} onPress={closeModal}/>
                </Pressable>
                <Text>{name}</Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
        borderRadius: 10
    },
    close: {
        color: rasoiBoxGrey,
        padding: 20,
    },
    modal: {
        alignItems: 'center'
    }
});