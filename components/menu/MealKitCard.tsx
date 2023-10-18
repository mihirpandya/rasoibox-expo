import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { rasoiBoxYellow } from '../../constants/Colors';
import Tags from "./Tags";

type MealKitCardProps = {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    servingSizes: number[],
    prices: number[],
    cookTime: number,
    prepTime: number,
    tags: string[],
    onPress: () => void;
}

export default function MealKitCard(props: MealKitCardProps) {
    const {
        id,
        name,
        description,
        imageUrl,
        servingSizes,
        prices,
        cookTime,
        prepTime,
        tags,
        onPress
    } = props;

    return (
        <Pressable onPress={onPress}>
            <Card style={styles.card}>
                <Card.Cover style={styles.cover} source={{uri: imageUrl}} />
                <Card.Title titleStyle={styles.title} title={name}/>
                <Card.Content>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                    <Tags tags={tags} time={prepTime + cookTime} containerStyle={styles.containerStyle}/>
                </Card.Content>
            </Card>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width < 700 ? 170 : 270,
        height: Dimensions.get('window').width < 700 ? 300 : 370,
        backgroundColor: 'white',
        margin: 5
    },
    cover: {
        borderRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: Dimensions.get('window').width < 700 ? 100 : 185
    },
    title: {
        color: 'black',
        fontFamily: 'AvenirLight',
        fontSize: Dimensions.get('window').width < 700 ? 16 : 20,
    },
    description: {
        fontFamily: 'AvenirLight',
        fontSize: Dimensions.get('window').width < 700 ? 14 : 15,
        color: 'black',
        marginTop: -10,
    },
    containerStyle: {
        position: 'absolute',
        marginTop: 95,
        width: Dimensions.get('window').width < 700 ? 140 : 220
    }
})