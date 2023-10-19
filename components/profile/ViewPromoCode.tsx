import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, Dimensions } from "react-native";
import { rasoiBoxYellow } from '../../constants/Colors';
import ResponseText from '../common/ResponseText';
import { PromoCode } from "./Profile";
import { ellipsify } from '../../constants/utils';

function ellipsifyPromoCode(promoCodeName: string): string {
    return Dimensions.get('window').width < 700 ? 
            ellipsify(promoCodeName, 8) :
            ellipsify(promoCodeName, 25)
}

export default function ViewPromoCode(props: {
    promoCode: PromoCode
}) {
    const { promoCode } = props
    const [showCopy, setShowCopy] = useState<boolean>(false)
    const [expandPromo, setExpandPromo] = useState<boolean>(false)

    function copyToClipboard(promoCode: string) {
        navigator.clipboard.writeText(promoCode)
        setShowCopy(true)
        setTimeout(() => setShowCopy(false), 1000)
    }

    function isExpanded() {
        return (expandPromo && ellipsifyPromoCode(promoCode.promoCodeName) != promoCode.promoCodeName)
    }

    return (
        <View style={styles.container}>
            <View style={isExpanded() ? styles.wideCell : styles.cell}>
                <Pressable 
                    disabled={ellipsifyPromoCode(promoCode.promoCodeName) == promoCode.promoCodeName}
                    onPress={() => {setExpandPromo(!expandPromo)}}>
                    <Text style={styles.fieldValue}>{
                        expandPromo ? promoCode.promoCodeName : ellipsifyPromoCode(promoCode.promoCodeName)
                    }</Text>
                </Pressable>
            </View>

            {!isExpanded() && promoCode.amountOff && <View style={styles.cell}>
                    <Text style={styles.fieldValue}>{promoCode.amountOff} off</Text>
                </View>
            }
            
            {!isExpanded() && promoCode.percentOff && <View style={styles.cell}>
                    <Text style={styles.fieldValue}>{promoCode.percentOff}% off</Text>
                </View>
            }
            
            <View style={styles.cell}>
                <Text style={styles.fieldValue}>{promoCode.status}</Text>
            </View>

            <View style={styles.cell}>
                {
                    promoCode.orderId ? 
                    <Pressable onPress={() => window.open("/order/" + promoCode.orderId, "_self")}>
                        <View style={styles.button}>
                            <Text style={styles.viewDetails}>Order</Text>
                            <Entypo name="chevron-small-right" size={18} color={rasoiBoxYellow} />
                        </View>
                    </Pressable> :
                    promoCode.status == "Redeemable" && <View style={{flexDirection: 'row'}}>
                        {!showCopy && <Pressable onPress={() => copyToClipboard(promoCode.promoCodeName)} style={styles.clipboard}>
                            <FontAwesome5 name="copy" size={15} color={rasoiBoxYellow} />
                        </Pressable>}
                        {showCopy && <ResponseText message='Copied!' isError={false}/>}
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingLeft: 30,
        paddingRight: 30
    },
    cell: {
        width: '25%',
        flexDirection: 'row',
    },
    wideCell: {
        width: '50%',
        flexDirection: 'row',
    },
    fieldValue: {
        fontFamily: 'AvenirLight',
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: Dimensions.get('window').width < 700 ? 12 : 15
    },
    clipboard: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    viewDetails: {
        fontFamily: 'AvenirLight',
        color: rasoiBoxYellow,
        fontSize: Dimensions.get('window').width < 700 ? 12 : 15
    }
});