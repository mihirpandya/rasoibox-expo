import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Modal from "react-native-modal";
import { rasoiBoxGrey } from '../../constants/Colors';

export enum LightboxSide { left, right }

interface LightboxProps {
    isVisible: boolean;
    side: LightboxSide;
    width: number;
    closeLightbox: () => void;
    children: React.ReactNode;
}

interface PositionDetails {
    animationIn: "slideInLeft" | "slideInRight",
    animationOut: "slideOutLeft" | "slideOutRight",
    modalViewStyle: StyleProp<ViewStyle>,
    modalStyle: StyleProp<ViewStyle>,
    closePressableStyle: StyleProp<ViewStyle>
}

function getPositionDetails(width: number, side: LightboxSide): PositionDetails {
    if (side === LightboxSide.left) {
        return {
            animationIn: 'slideInLeft',
            animationOut: 'slideOutLeft',
            modalViewStyle: {
                flex: 1,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                backgroundColor: 'white',
                position: 'absolute',
                marginLeft: '-6%',
                width: width,
                height: Dimensions.get('window').height + 10,
                marginTop: '-6%'
            },
            modalStyle: {
                flexDirection: 'row',
                justifyContent: 'flex-start'
            },
            closePressableStyle: {
                flexDirection: 'row',
                justifyContent: 'flex-start'
            }
        }
    } else {
        return {
            animationIn: 'slideInRight',
            animationOut: 'slideOutRight',
            modalViewStyle: {
                flex: 1,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                backgroundColor: 'white',
                position: 'absolute',
                marginRight: '-6%',
                width: width,
                height: Dimensions.get('window').height + 10,
                marginTop: '-6%',
            },
            modalStyle: {
                flexDirection: 'row',
                justifyContent: 'flex-end'
            },
            closePressableStyle: {
                flexDirection: 'row',
                justifyContent: 'flex-end'
            }
        }
    }
}

export default function Lightbox(props: LightboxProps) {
    const { isVisible, width, side, closeLightbox, children } = props;

    const { animationIn, animationOut, modalViewStyle, modalStyle, closePressableStyle } = getPositionDetails(width, side);

    return (
        <Modal 
            isVisible={isVisible}
            onBackdropPress={closeLightbox}
            animationIn={animationIn}
            animationOut={animationOut}
            backdropOpacity={0.0}
            style={modalStyle}
        >
            <View style={modalViewStyle}>
                <Pressable onPress={closeLightbox} style={closePressableStyle}>
                    <AntDesign name="close" style={styles.close} size={25} />
                </Pressable>
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    close: {
        color: rasoiBoxGrey,
        padding: 20,
    },
});