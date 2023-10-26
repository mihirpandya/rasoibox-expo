import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
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
    createdBy: string,
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
        createdBy,
        onPress
    } = props;

    function getContainerStyle() {
        if (createdBy == "Rasoi Box") {
            return styles.containerStyle
        } else {
            return styles.containerStyleWithCreator
        }
    }

    return (
        <Pressable onPress={onPress}>
            <Card style={styles.card}>
                <Card.Cover style={styles.cover} source={{uri: imageUrl}} />
                {
                createdBy == "Rasoi Box" ?
                    <Card.Title titleStyle={styles.title} title={name}/> :
                    <Card.Title titleStyle={styles.title} title={name} subtitle={"by " + createdBy} subtitleStyle={styles.subtitle}/>
                }
                <Card.Content>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                    <Tags tags={tags} time={prepTime + cookTime} containerStyle={getContainerStyle()}/>
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
        margin: Dimensions.get('window').width < 700 ? 5 : 15,
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
    subtitle: {
        color: rasoiBoxPink,
        fontFamily: 'AvenirLight',
        fontSize: Dimensions.get('window').width < 700 ? 10 : 12,
        marginTop: -10
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
    },
    containerStyleWithCreator: {
        position: 'absolute',
        marginTop: 75,
        width: Dimensions.get('window').width < 700 ? 140 : 220
    }
})