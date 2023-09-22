import React from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { RecipeMetadata } from "./RecipeInfo";
import Tags from '../menu/Tags';
import { rasoiBoxGrey } from '../../constants/Colors';

export default function ViewRecipeMetadata(props: {servingSize: number, recipeMetadata: RecipeMetadata}) {
    const { servingSize, recipeMetadata } = props;
    console.log(recipeMetadata);

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
        marginTop: 30,
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginRight:  Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        width: Dimensions.get('window').width < 700 ? Dimensions.get('window').width - 10 : Dimensions.get('window').width / 3,
    },
    recipeImage: {
        width: 477,
        height: 350,
        borderRadius: 10,
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