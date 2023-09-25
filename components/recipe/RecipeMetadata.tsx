import React from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { RecipeMetadata } from "./RecipeInfo";
import Tags from '../menu/Tags';
import { rasoiBoxGrey } from '../../constants/Colors';

function getImageWidth() {
    const windowWidth = Dimensions.get('window').width
    if (windowWidth < 700) {
        return windowWidth - 10
    } else {
        return 477
    }
}

function getImageHeight() {
    const width = getImageWidth()
    return width * 0.75
}

export default function ViewRecipeMetadata(props: {servingSize: number, recipeMetadata: RecipeMetadata}) {
    const { servingSize, recipeMetadata } = props;

    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.recipeName}>{recipeMetadata.recipeName}</Text>
                <Tags tags={recipeMetadata.tags} />
                <Text style={styles.description}>
                    {recipeMetadata.longDescription}
                </Text>
                <View style={styles.timings}>
                    <Text style={styles.timing} >Prep Time: {recipeMetadata.prepTime} mins</Text>
                    <Text style={styles.timing} >Cook Time: {recipeMetadata.cookTime} mins</Text>
                    <Text style={styles.timing} >Serves: {servingSize} people</Text>
                </View>
            </View>
            <Image style={styles.recipeImage} source={{uri: recipeMetadata.imageUrl}}></Image>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginRight:  Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginTop: 30,
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        padding: Dimensions.get('window').width < 700 ? 0 : 30,
    },
    info: {
        width: Dimensions.get('window').width < 700 ? Dimensions.get('window').width - 30 : Dimensions.get('window').width / 3,
    },
    recipeImage: {
        width: getImageWidth(),
        height: getImageHeight(),
        borderRadius: 10,
        marginLeft: Dimensions.get('window').width < 700 ? '-1.25%' : '0%'
    },
    recipeName: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 35,
        paddingBottom: 5,
    },
    description: {
        color: rasoiBoxGrey,
        marginTop: 30,
        fontFamily: 'AvenirLight',
        fontSize: 16,
        paddingRight: Dimensions.get('window').width < 700 ? 5 : 15,
        width: Dimensions.get('window').width < 700 ? Dimensions.get('window').width - 10 : Dimensions.get('window').width / 3,
    },
    timings: {
        paddingTop: 30,
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row'
    },
    timing: {
        fontFamily: 'AvenirLight',
        fontSize: 14,
        paddingRight: 20,
    }
})