import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import RecipeConclusion from './RecipeConclusion';
import { RecipeStep } from "./RecipeInfo";

function stepTitle(title: string): string {
    const upperCase = title.charAt(0).toUpperCase()
    return upperCase + title.substring(1)
}

function ViewStep(props: { step: RecipeStep }) {
    const { step } = props;
    return (
        <View>
            <Text style={styles.stepName}>
                {step.stepNumber}. {stepTitle(step.title)}
            </Text>
            {step.instructions.map(line => {
                return (
                    <Text key={line} style={styles.instructions}>
                        {line}
                    </Text>     
                )
            })}
            {
                (step.gifUrl != undefined && step.gifUrl.length > 0) && 
                step.gifUrl.map(gif => {
                    return (
                        <Image style={styles.stepImage} key={gif} source={{uri: gif}}/>
                    )
                })
            }
        </View>
    )
}

export default function ViewRecipeSteps(props: {recipeSteps: RecipeStep[]}) {
    const { recipeSteps } = props;

    return (
        <View style={styles.card}>
            <FlatList data={recipeSteps} renderItem={({item}) => <ViewStep step={item} />}/>
            <RecipeConclusion />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginRight:  Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        padding: 30
    },
    stepCard: {

    },
    instructions: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingBottom: 20,
    },
    stepName: {
        fontSize: 17,
        fontFamily: 'AvenirLight',
        paddingBottom: 20,
    },
    stepImage: {
        width: 300,
        height: 250
    }
})