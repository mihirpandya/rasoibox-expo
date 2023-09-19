import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";
import AuthShim from "../../components/common/AuthShim";
import OrderInformation from "../../components/order/OrderInformation";

export default function ViewOrder() {
    const { orderNumber } = useLocalSearchParams();
    console.log(orderNumber);
    
    return (
        orderNumber != undefined ? 
        <AuthShim authChild={<OrderInformation orderNumber={orderNumber}/>} unauthChild={<Redirect href="/" />} /> :
        <Redirect href="/menu" />
    );
}