import { EvilIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from "react-native-modal";
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from "../../constants/Colors";
import { emitEvent, updateCart } from '../../app/api/rasoibox-backend';
import Tags from './Tags';
import { capitalizeFirst } from '../../constants/utils';
import { WebsiteEvent } from '../../constants/EventTypes';

interface MealKitModalProps {
    isVisible: boolean,
    closeModal: () => void,
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    servingSizes: number[],
    prices: number[],
    cookTime: number,
    prepTime: number,
    tags: string[],
    verificationCode: string | undefined
}

function twoDecimals(num: number): string {
    return num.toFixed(2)
}

function getServingSizeStyle(isSelected: boolean): any {
    return isSelected ? styles.servingSizeSelected : styles.servingSizeUnselected;
}

function ServingSize(props: {servingSize: number, isSelected: boolean, onPress: () => void}) {
    return (<Pressable onPress={props.onPress}>
        <View>
            <Text style={getServingSizeStyle(props.isSelected)}>{props.servingSize} servings</Text>
        </View>
    </Pressable>);
}

export default function MealKitModal(props: MealKitModalProps) {
    const { 
        isVisible,
        closeModal,
        id,
        name,
        description,
        imageUrl,
        servingSizes,
        prices,
        cookTime,
        prepTime,
        tags,
        verificationCode
    } = props;

    servingSizes.sort()
    prices.sort()

    const [selectedServingSize, setSelectedServingSize] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    const servingSize = servingSizes[selectedServingSize];
    const price = prices[selectedServingSize];

    function addToCart(recipeName: string, servingSize: number) {
        if (verificationCode != undefined) {
            setLoading(true)
            updateCart(verificationCode, recipeName, servingSize)
                .then(_response => closeModal())
                .finally(() => setLoading(false))
        } else {
            closeModal()
            window.open("/signin", "_self")
        }
    }

    useEffect(() => {
        if (verificationCode) {
            emitEvent(WebsiteEvent.MENU_ITEM, new Date(), verificationCode, name)
        }
    }, [])

    return (
        <Modal isVisible={isVisible} style={styles.modal} animationIn={'fadeIn'} animationOut={'fadeOut'} onBackdropPress={closeModal}>
            <View style={styles.modalView}>
                <Pressable style={styles.close}>
                    <EvilIcons name="close-o" size={25} onPress={closeModal}/>
                </Pressable>
                <View style={styles.content}>
                    <ScrollView>
                        <View style={styles.header}>
                            <Text style={styles.title}>{name}</Text>
                            <Tags tags={tags} time={prepTime + cookTime} tagStyle={{marginTop: 10, height: 20}} />
                        </View>
                        <Image style={styles.image} source={{uri: imageUrl}} />
                        {/* <View style={styles.timings}>
                            <Text style={styles.timing} >Prep Time: {prepTime} mins</Text>
                            <Text style={styles.timing} >Cook Time: {cookTime} mins</Text>
                        </View> */}
                        <Text style={styles.description}>{capitalizeFirst(description)}</Text>
                        <View style={{marginTop: 20, flexDirection: 'row'}}>
                            <Text style={styles.price}>
                                ${price}
                            </Text>
                            <Text style={styles.pricePerServing}>
                                ({twoDecimals(price / servingSize)}/serving)
                            </Text>
                        </View>
                        <View style={styles.servings}>
                            <Text style={styles.subheading}>Serving Size: {servingSize} people</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {Object.keys(servingSizes).map(index => <ServingSize 
                                    key={index}
                                    servingSize={servingSizes[index]}
                                    isSelected={index === selectedServingSize.toString()}
                                    onPress={() => setSelectedServingSize(index)} 
                                    />)}
                            </View>
                        </View>
                    </ScrollView>
                    {
                        loading ? <ActivityIndicator size={"large"} color={rasoiBoxPink} style={{paddingBottom: 30}} /> :
                        <Pressable onPress={() => addToCart(name, servingSizes[selectedServingSize])}>
                            <View style={styles.a2cButton}>
                                <Text style={styles.a2cText}>
                                    {verificationCode != undefined ? "Add to cart" : "Sign in to place order"}
                                </Text>
                            </View>
                        </Pressable>
                    }
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        width: Dimensions.get('window').width < 700 ? '100%' : '40%',
        height: Dimensions.get('window').height - 70,
        borderRadius: 10,
        flexDirection: 'column',
        position: 'absolute'
    },
    close: {
        padding: 20,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    modal: {
        alignItems: 'center',
    },
    image: {
        justifyContent: 'center',
        width: '100%',
        height: Dimensions.get('window').width < 700 ? 200 : 300,
        marginTop: 10,
    },
    header: {
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: 'CormorantGaramondSemiBold',
        fontSize: 30,
        paddingLeft: 5
    },
    content: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1
    },
    description: {
        fontFamily: 'AvenirLight',
        fontSize: 15,
        marginTop: 10,
        paddingLeft: 5
    },
    servings: {
        marginTop: 30,
    },
    subheading: {
        fontSize: 15,
        fontFamily: 'AvenirLight',
        fontWeight: 'bold',
    },
    a2cButton: {
        borderRadius: 20,
        backgroundColor: rasoiBoxYellow,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    a2cText: {
        fontFamily: 'AvenirLight',
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    servingSizeSelected: {
        fontFamily: 'AvenirLight',
        color: 'white',
        backgroundColor: rasoiBoxYellow,
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        marginRight: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: rasoiBoxYellow
    },
    servingSizeUnselected: {
        fontFamily: 'AvenirLight',
        color: rasoiBoxYellow,
        borderWidth: 1,
        borderColor: rasoiBoxYellow,
        backgroundColor: 'white',
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        marginRight: 20,
        marginBottom: 10
    },
    price: {
        fontFamily: 'AvenirLight',
        fontSize: 20
    },
    pricePerServing: {
        fontFamily: 'AvenirLight',
        fontSize: 12,
        paddingTop: 8,
        paddingLeft: 8,
        color: 'grey'
    },
    timings: {
        paddingTop: 5,
        paddingLeft: 5,
        flexDirection: Dimensions.get('window').width < 700 ? 'column' : 'row'
    },
    timing: {
        fontFamily: 'AvenirLight',
        fontSize: 14,
        paddingRight: 20,
    }
});