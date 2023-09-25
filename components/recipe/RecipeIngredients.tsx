import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { borderGrey, rasoiBoxPink } from '../../constants/Colors';
import { InYourKitchen, Ingredient } from "./RecipeInfo";
import { capitalizeFirst } from '../../constants/utils';

function showNumber(fraction: number) {
	if (fraction == 0.5) {
		return "1/2"
	} else if (fraction == 0.75) {
		return "3/4"
	} else if (fraction == 0.25) {
		return "1/4"
	} else if (fraction == 1.5) {
		return "1 1/2"
	} else {
		return fraction
	}
}

function ViewIngredient(props: { servingSize: number, ingredient: Ingredient }) {
    const { servingSize, ingredient } = props;
    const amount: number = ingredient.quantities.filter(q => q.servingSize === servingSize)[0].amount
    return (
        <Text style={styles.ingredient}>
            {showNumber(amount) + " " + ingredient.unit + " " + ingredient.name}
        </Text>
    )
}

function ViewInYourKitchen(props: { inYourKitchen: InYourKitchen }) {
    const { inYourKitchen } = props;
    let rendered: string = capitalizeFirst(inYourKitchen.name)
    if (inYourKitchen.or_.length > 0) {
        inYourKitchen.or_.forEach(or => {
            rendered = rendered + " / " + capitalizeFirst(or)
        })
    }
    return (
        <Text style={styles.ingredient}>
            {rendered}
        </Text>
    )
}

export default function ViewRecipeIngredients(props: { 
    servingSize: number, 
    ingredients: Ingredient[], 
    inYourKitchen: InYourKitchen[] 
}) {
    const { servingSize, ingredients, inYourKitchen } = props;
    
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Ingredients</Text>
            <View style={styles.container}>
                <View style={styles.column}>
                    <Text style={styles.subtitle}>In your Rasoi Box:</Text>
                    <FlatList 
                        data={ingredients}
                        renderItem={
                            ({item}) => <ViewIngredient servingSize={servingSize} ingredient={item} />
                    }/>
                </View>
                <View style={styles.column}>
                    <Text style={styles.subtitle}>In your kitchen:</Text>
                    <FlatList 
                        data={inYourKitchen}
                        renderItem={
                            ({item}) => <ViewInYourKitchen inYourKitchen={item} />
                    }/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginRight:  Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        padding: Dimensions.get('window').width < 700 ? 0 : 30,
        paddingTop: 100,
    },
    container: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        color: rasoiBoxPink,
        fontSize: 25,
        paddingBottom: 20,
        paddingTop: 30,
        borderTopWidth: 1,
        borderTopColor: borderGrey
    },
    subtitle: {
        fontFamily: 'AvenirLight',
        fontSize: 18,
        paddingBottom: 10,
    },
    column: {
        width: Dimensions.get('window').width < 700 ? '100%' : '50%',
    },
    ingredient: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        paddingLeft: Dimensions.get('window').width < 700 ? 30 : 10,
        paddingBottom: 5
    }
});