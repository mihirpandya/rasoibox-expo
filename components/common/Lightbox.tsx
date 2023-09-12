import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Modal from "react-native-modal";
import { rasoiBoxGrey } from '../../constants/Colors';

interface LightboxProps {
    isVisible: boolean;
    closeLightbox: () => void;
    children: React.ReactNode;
}

export default function Lightbox(props: LightboxProps) {
    const { isVisible, closeLightbox, children } = props;

    return (
        <Modal 
            isVisible={isVisible}
            onBackdropPress={closeLightbox}
            animationIn={'slideInLeft'}
            animationOut={'slideOutLeft'}
            backdropOpacity={0.0}
        >
            <View style={styles.modalView}>
                <Pressable onPress={closeLightbox}>
                    <AntDesign name="close" style={styles.close} size={25} />
                </Pressable>
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        position: 'absolute',
        marginLeft: '-6%',
        width: 300,
        height: Dimensions.get('window').height + 10,
    },
    close: {
        color: rasoiBoxGrey,
        padding: 20,
        borderBottomWidth: 1,
    },
});