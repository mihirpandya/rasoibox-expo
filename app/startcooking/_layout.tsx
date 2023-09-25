import { Redirect } from "expo-router";
import React from "react";
import AuthShim from "../../components/common/AuthShim";
import ViewStartCooking from "../../components/startcooking/StartCooking";

export default function StartCooking() {
    return <AuthShim authChild={<ViewStartCooking />} unauthChild={<Redirect href="/signin" />}/>
}