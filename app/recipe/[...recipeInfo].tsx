import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from 'react-native';
import AuthShim from "../../components/common/AuthShim";

export default function ViewRecipe() {
    const { recipeInfo } = useLocalSearchParams();
    console.log(recipeInfo);
    
    return (
        (recipeInfo != undefined) ? 
        <AuthShim authChild={<Text> win </Text>} unauthChild={<Redirect href="/" />} /> :
        <Redirect href="/menu" />
    );
}