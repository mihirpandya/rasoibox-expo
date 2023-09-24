import React from "react";
import {
    Image,
    ImageStyle,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle
} from "react-native";

function getSlideStyle(width: number, height: number): StyleProp<ViewStyle> {
    return {
        height: height,
        width: width,
        justifyContent: "center",
        alignItems: "center",
    }
}

function getSlideImageStyle(width: number, height: number): StyleProp<ImageStyle> {
    return {
        width: width * 0.9, 
        height: height * 0.8,
        borderRadius: 10
    }
}

export default function Slide(props: {
    image: string, 
    title: string, 
    subtitle: string,
    width: number,
    height: number
}) {
    const { image, title, subtitle, width, height } = props;
    return (
        <View style={getSlideStyle(width, height)}>
            <Image source={{ uri: image }} style={getSlideImageStyle(width, height)} />
            <Text style={styles.slideTitle}>{title}</Text>
            <Text style={styles.slideSubtitle}>{subtitle}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    slideTitle: { 
        fontSize: 24 
    },
    slideSubtitle: { 
        fontSize: 18 
    }
  });