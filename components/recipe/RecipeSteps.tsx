import React from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
                <View style={styles.imageContainer}>
                    <ScrollView 
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={true}
                    >
                        {step.gifUrl.map(url => (
                                <Image style={styles.stepImage} key={url} source={{uri: url}} />
                            )
                        )}
                    </ScrollView>
                </View>
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
        padding: 30,
        paddingTop: 100
    },
    instructions: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    stepName: {
        fontSize: 20,
        fontFamily: 'AvenirLight',
        paddingBottom: 20,
    },
    stepImage: {
        width: 636,
        height: 487,
        borderRadius: 10
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})