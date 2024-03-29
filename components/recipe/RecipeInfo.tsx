import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { emitEvent, getRecipeById, getRecipeMetadata, getRecipeSteps } from '../../app/api/rasoibox-backend';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import ViewRecipeMetadata from "./RecipeMetadata";
import ViewRecipeSteps from "./RecipeSteps";
import ViewRecipeIngredients from "./RecipeIngredients";
import { rasoiBoxPink } from '../../constants/Colors';
import { AuthDetails } from '../common/AuthShim';
import * as Storage from "../common/Storage";
import { WebsiteEvent } from '../../constants/EventTypes';

export interface Quantity {
    amount: number,
    servingSize: number
}

export interface Ingredient {
    name: string,
    quantities: Quantity[],
    unit: string
}

export interface InYourKitchen {
    name: string
    or_: string[]
}

export interface RecipeMetadata {
    recipeId: number,
    recipeName: string,
    ingredients: Ingredient[],
    inYourKitchens: InYourKitchen[],
    prepTime: number,
    cookTime: number,
    imageUrl: string,
    longDescription: string,
    tags: string[]
}

export interface RecipeStep {
    stepNumber: number,
    title: string,
    instructions: string[],
    tips: string[],
    chefsHats: string[],
    ingredients: string[],
    inYourKitchen: string[],
    gifUrl?: string[]
}

export default function RecipeInfo(props: {recipeId: number, servingSize: number}) {
    const { recipeId, servingSize } = props

    const [recipeName, setRecipeName] = useState<string | undefined>()
    const [recipeMetadata, setRecipeMetadata] = useState<RecipeMetadata>()
    const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([])
    const [authDetails, setAuthDetails] = useState<AuthDetails>()

    function fetchRecipeName() {
        getRecipeById(recipeId).then(response => {
            setRecipeName(response['recipe_name'])
        })
    }

    function fetchRecipeMetadata() {
        if (recipeName) {
            getRecipeMetadata(recipeName, servingSize).then(response => {

                const inYourKitchens: InYourKitchen[] = response['in_your_kitchens'].map(item => {
                    return {
                        name: item['name'],
                        or_: item['or_']
                    }
                })

                const ingredients: Ingredient[] = response['ingredients'].map(item => {
                    return {
                        name: item['name'],
                        unit: item['unit'],
                        quantities: item['quantities'].map(q => {
                            return {
                                amount: q['amount'],
                                servingSize: q['serving_size']
                            }
                        })
                    }
                })

                const recipeMetadata: RecipeMetadata = {
                    recipeId: response['recipe_id'],
                    recipeName: response['recipe_name'],
                    ingredients: ingredients,
                    inYourKitchens: inYourKitchens,
                    prepTime: response['prep_time'],
                    cookTime: response['cook_time'],
                    imageUrl: response['image_url'],
                    longDescription: response['long_description'],
                    tags: response['tags']
                }

                setRecipeMetadata(recipeMetadata)
            })
        }
    }

    function fetchRecipeSteps() {
        if (recipeName) {
            getRecipeSteps(recipeName, servingSize).then(response => {
                const recipeSteps: RecipeStep[] = response.map(item => {
                    return {
                        stepNumber: item['step_number'],
                        title: item['title'],
                        instructions: item['instructions'],
                        tips: item['tips'],
                        chefsHats: item['chefs_hats'],
                        ingredients: item['ingredients'],
                        inYourKitchen: item['in_your_kitchen'],
                        gifUrl: item['gif_url']
                    }
                })

                setRecipeSteps(recipeSteps)
            })
        }
    }

    useEffect(() => {
        fetchRecipeName()
        Storage.getAuthDetails().then((authDetails: AuthDetails | null) => {
            if (authDetails) {
                setAuthDetails(authDetails)
            }
        })
    }, [])

    useEffect(() => {
        fetchRecipeMetadata()
    }, [recipeName])

    useEffect(() => {
        if (authDetails?.verification_code && recipeName) {
            emitEvent(WebsiteEvent.RECIPE, new Date(), authDetails.verification_code, recipeName)
        }
    }, [recipeName, authDetails])

    useEffect(() => {
        fetchRecipeSteps()
    }, [recipeName])

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView>
                <Header hideStartCooking={true}/>
                {
                    recipeMetadata ? <ViewRecipeMetadata servingSize={servingSize} recipeMetadata={recipeMetadata} /> :
                    <ActivityIndicator color={rasoiBoxPink} size="large" style={{margin: 30}}/>
                }
                {recipeMetadata && authDetails?.verification_code && <ViewRecipeIngredients servingSize={servingSize} ingredients={recipeMetadata.ingredients} inYourKitchen={recipeMetadata.inYourKitchens}/>}
                {recipeMetadata && recipeSteps.length > 0 && <ViewRecipeSteps verificationCode={authDetails?.verification_code} recipeId={recipeId} recipeSteps={recipeSteps} />}
                
                <Footer />
            </ScrollView>
        </View>
    )
}
