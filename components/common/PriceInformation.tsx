import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { rasoiBoxGrey } from '../../constants/Colors';
import { getPromoAmount, twoDecimals } from "../../constants/utils";
import { PromoCode } from "../checkout/Checkout";

interface PriceInformationProps {
    appliedPromoCode: PromoCode | undefined,
    subtotal: number,
    shipping: number,
    total: number,
    showDelete?: boolean,
    deleteAppliedPromoCode?: () => void,
    showTaxes?: boolean
}

export default function PriceInformation(props: PriceInformationProps) {
    const { appliedPromoCode, subtotal, shipping, total, showDelete, deleteAppliedPromoCode, showTaxes } = props;
    return (
        <View>
            <View style={styles.subtotal}>
                <View style={styles.section}>
                    <Text style={styles.key}>Subtotal</Text>
                    <Text style={styles.value}>${twoDecimals(subtotal)}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.key}>Shipping</Text>
                    <Text style={styles.value}>{shipping == 0 ? "FREE" : "$" + shipping}</Text>
                </View>
                {
                    appliedPromoCode != undefined &&
                    <View style={styles.section}>
                        <Text style={styles.key}>{appliedPromoCode.name}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.value}>{getPromoAmount(appliedPromoCode)}</Text>
                            {showDelete && <Pressable style={{paddingLeft: 5}} onPress={deleteAppliedPromoCode}>
                                <Ionicons name="trash-outline" size={15} color={rasoiBoxGrey} />
                            </Pressable>}
                        </View>
                    </View>
                }
                {
                    showTaxes && <View style={styles.section}>
                        <Text style={styles.key}>Taxes</Text>
                        <Text style={styles.value}>Calculated at next step</Text>
                    </View>
                }
            </View>
            <View style={styles.total}>
                <View style={styles.section}>
                    <Text style={styles.key}>Total</Text>
                    <Text style={styles.value}>${twoDecimals(total)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    subtotal: {
        borderTopWidth: 1,
        borderColor: '#808080',
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    total: {
        borderTopWidth: 1,
        borderColor: '#808080',
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 20,
        paddingTop: 10
    },
    section: {
        flexDirection: 'row',
        paddingTop: 4,
        paddingBottom: 4,
        justifyContent: 'space-between'
    },
    key: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
    },
    value: {
        fontFamily: 'AvenirLight',
        fontSize: 15
    }
});