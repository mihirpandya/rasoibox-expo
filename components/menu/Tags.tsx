import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { rasoiBoxYellow } from '../../constants/Colors';
import { EvilIcons } from '@expo/vector-icons';

function getContainerStyle(additions: any): StyleProp<ViewStyle> {
    if (additions == undefined) {
        return styles.tags;
    }

    let style = {
        ...additions,
        ...styles.tags,
    }

    return style;
}

function getTagStyle(additions: any): StyleProp<ViewStyle> {
    if (additions == undefined) {
        return styles.tag;
    }

    let style = {
        ...additions,
        ...styles.tag,
    }

    return style;
}

export default function Tags(props: {
    tags: string[],
    time: number,
    containerStyle?: StyleProp<ViewStyle>,
    tagStyle?: StyleProp<ViewStyle>
}) {
    const { tags, time, containerStyle, tagStyle} = props
    return (
        <View style={getContainerStyle(containerStyle)}>
            <Text key="time" style={getTagStyle(tagStyle)}>
                <EvilIcons style={{paddingRight: 2}} name="clock" size={15} color="white" />
                {time + "m"}
            </Text>
            {tags.map(tag => <Text key={tag} style={getTagStyle(tagStyle)}>{tag}</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    tags: {
        flexDirection: 'row',
    },
    tag: {
        fontSize: 12,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        marginRight: 10,
        fontFamily: 'AvenirLight',
        backgroundColor: rasoiBoxYellow,
        borderRadius: 10,
        color: 'white'
    }
})