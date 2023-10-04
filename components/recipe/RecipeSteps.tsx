import { Foundation } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { borderGrey, rasoiBoxPink, rasoiBoxYellow } from '../../constants/Colors';
import { capitalizeFirst, pluralize } from '../../constants/utils';
import Carousel from "../common/carousel/Carousel";
import RecipeConclusion from './RecipeConclusion';
import { RecipeStep } from "./RecipeInfo";
import { MaterialCommunityIcons } from '@expo/vector-icons';

function parseTip(tip: string): string {
    let newTip = tip.replaceAll('<br />', '\n')
    newTip = newTip.replaceAll('<ul>', '')
    newTip = newTip.replaceAll('</ul>', '')
    newTip = newTip.replaceAll('<li>', '  - ')
    newTip = newTip.replaceAll('</li>', '\n')
    return newTip
}

function RenderInstructions(props: { instruction: string, ingredients: string[] }) { 
    const { instruction, ingredients } = props;

	const words = instruction.split(" ")
    
    const instructions: React.ReactNode[] = []

	for (let i = 0; i < words.length; i++) {
		let word_with_new_lines = words[i];
		let words_wo_new_lines = word_with_new_lines.split("\n")
		for (let j = 0; j < word_with_new_lines.length; j++) {
			const word = words_wo_new_lines[j];
			if (word != undefined) {
				const matchingIngredient = ingredients.find(ingredient => {
					if (word.match(ingredient) != null || word.match(pluralize(ingredient, 2)) != null) {
						return true;
					}

					const ingredient_words = ingredient.split(" ")
					const matchingIngredientWord = ingredient_words.find(ingredient_word => {
						return (word.match(ingredient_word) != null || word.match(pluralize(ingredient_word, 2)) != null)
					})
					return (matchingIngredientWord != undefined)
				})

				if (matchingIngredient != undefined) {
					words_wo_new_lines[j] = "<b>" + word + "</b>"
                    instructions.push(<Text key={i + j} style={styles.bold}>{word}</Text>)
				} else {
                    instructions.push(<Text key={i + j} style={styles.instructions}>{word}</Text>)
                }
			}
		}
		words[i] = words_wo_new_lines.join("\n")
	}

    return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20}}>
            {instructions}
        </View>
    )

	// return "<div style='font-family: Avenir Light; font-size: 15px; line-height: 1.6'>" + words.join(" ").replaceAll("\n", "<br />") + "</div>"
}

function ViewStep(props: { verificationCode: string, step: RecipeStep }) {
    const { verificationCode, step } = props;

    return (
        <View>
            <Text style={styles.stepName}>
                {step.stepNumber}. {capitalizeFirst(step.title)}
            </Text>
            {step.instructions.map(line => {
                return (
                    <RenderInstructions key={line} instruction={line} ingredients={step.ingredients} />
                )
            })}
            {
                (step.gifUrl != undefined && step.gifUrl.length > 0) && 
                <Carousel 
                    width={styles.stepImage.width}
                    height={styles.stepImage.height}
                    carouselData={step.gifUrl.map(url => {
                        return {
                            imageUrl: url
                        }
                    })}
                />
            }
            {
                (step.tips != undefined && step.tips.length > 0) &&
                <View style={styles.tip}>
                    <View style={{flexDirection: 'row'}}>
                        <Foundation name="lightbulb" size={20} color={rasoiBoxPink} />
                        <Text style={styles.tipTitle}>Tips:</Text>
                    </View>
                    {step.tips.map(tip => <Text style={styles.tipContent} key={tip}>{parseTip(tip)}</Text>)}
                </View>
            }

            {
                (step.chefsHats != undefined && step.chefsHats.length > 0) &&
                <View style={styles.chefsHat}>
                    <View style={{flexDirection: 'row'}}>
                        <MaterialCommunityIcons name="chef-hat" size={20} color={rasoiBoxYellow} style={{marginTop: 3}}/>
                        <Text style={styles.chefsHatTitle}>Chef's Hat:</Text>
                    </View>
                    {step.chefsHats.map(chefsHat => <Text style={styles.chefsHatContent} key={chefsHat}>{parseTip(chefsHat)}</Text>)}
                </View>
            }
        </View>
    )
}

export default function ViewRecipeSteps(props: {verificationCode: string, recipeSteps: RecipeStep[]}) {
    const { verificationCode, recipeSteps } = props;

    return (
        <View style={styles.card}>
            <Text style={styles.directions}>Directions</Text>
            <FlatList
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 80,
                    minimumViewTime: 1000
                }}
                onViewableItemsChanged={info => {console.log(info)}}
                data={recipeSteps} 
                renderItem={({item}) => <ViewStep key={item.stepNumber} verificationCode={verificationCode} step={item} />}
            />
            <RecipeConclusion />
        </View>
    )
}

function getImageWidth() {
    const windowWidth = Dimensions.get('window').width
    if (windowWidth < 700) {
        return windowWidth - 10
    } else {
        return 636
    }
}

function getImageHeight() {
    const width = getImageWidth()
    return width * 0.75
}

const styles = StyleSheet.create({
    directions: {
        fontFamily: 'CormorantGaramondSemiBold',
        color: rasoiBoxPink,
        fontSize: 25,
        paddingBottom: 20,
        paddingTop: 30,
        borderTopWidth: 1,
        borderTopColor: borderGrey,
    },
    card: {
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginRight:  Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        padding: Dimensions.get('window').width < 700 ? 0 : 30,
    },
    instructions: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        paddingRight: 5,
    },
    bold: {
        fontFamily: 'AvenirLight',
        fontSize: 17,
        fontWeight: 'bold',
        color: rasoiBoxPink,
        paddingRight: 5
    },
    stepName: {
        fontSize: 20,
        fontFamily: 'AvenirLight',
        paddingBottom: 20,
    },
    stepImage: {
        width: getImageWidth(),
        height: getImageHeight(),
        borderRadius: 10,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    tip: {
        backgroundColor: 'rgba(241, 122, 126, 0.1)', // rasoi box pink with opacity
        borderRadius: 20,
        marginTop: 20,
        padding: 20,
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginRight:  Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginBottom: 30
    },
    chefsHat: {
        backgroundColor: 'rgba(249, 166, 108, 0.08)', // rasoi box yellow with opacity
        borderRadius: 20,
        padding: 20,
        marginLeft: Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginRight:  Dimensions.get('window').width < 700 ? '2.5%' : '15%',
        marginBottom: 30
    },
    chefsHatTitle: {
        color: rasoiBoxYellow,
        fontSize: 17,
        paddingBottom: 10,
        paddingLeft: 10,
        fontFamily: 'AvenirLight',
        fontWeight: 'bold'
    },
    chefsHatContent: {
        fontFamily: 'AvenirLight',
        color: rasoiBoxYellow,
        fontSize: 15,
        paddingTop: 10,
        lineHeight: 25
    },
    tipTitle: {
        color: rasoiBoxPink,
        fontSize: 17,
        paddingBottom: 10,
        paddingLeft: 10,
        fontFamily: 'AvenirLight',
        fontWeight: 'bold'
    },
    tipContent: {
        fontFamily: 'AvenirLight',
        color: rasoiBoxPink,
        fontSize: 15,
        paddingTop: 10,
        lineHeight: 25
    }
})