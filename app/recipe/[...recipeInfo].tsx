import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";
import RecipeInfo from "../../components/recipe/RecipeInfo";

export default function ViewRecipe() {
    const { recipeInfo } = useLocalSearchParams();
    const recipeId: number = Number(recipeInfo[0])
    const servingSize: number = Number(recipeInfo[1])
    
    return (
        (!isNaN(recipeId) && !isNaN(servingSize)) ? 
        <RecipeInfo recipeId={recipeId} servingSize={servingSize} /> :
        <Redirect href="/menu" />
    );
}