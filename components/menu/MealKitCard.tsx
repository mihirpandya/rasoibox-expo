import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
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
                    <Tags tags={tags} time={prepTime + cookTime} containerStyle={{position: 'absolute', marginTop: 95}}/>
                </Card.Content>
            </Card>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 270,
        height: 370,
        backgroundColor: 'white',
        margin: 20
    },
    cover: {
        borderRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        color: 'black',
        fontFamily: 'AvenirLight',
        fontSize: 20,
    },
    description: {
        fontFamily: 'AvenirLight',
        fontSize: 16,
        color: 'black'
    },
    tags: {
        flexDirection: 'row',
        position: 'absolute',
        marginTop: 95
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