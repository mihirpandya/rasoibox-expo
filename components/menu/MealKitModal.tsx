import { AntDesign } from '@expo/vector-icons';
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import { rasoiBoxGrey, rasoiBoxPink, rasoiBoxYellow } from "../../constants/Colors";

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
        tags
    } = props;

    servingSizes.sort()
    prices.sort()

    const [selectedServingSize, setSelectedServingSize] = useState<number>(0)

    const servingSize = servingSizes[selectedServingSize];
    const price = prices[selectedServingSize];

    return (
        <Modal isVisible={isVisible} style={styles.modal} animationIn={'fadeIn'} animationOut={'fadeOut'} onBackdropPress={closeModal}>
            <View style={styles.modalView}>
                <Pressable>
                    <AntDesign name="close" style={styles.close} size={25} onPress={closeModal}/>
                </Pressable>
                <View style={styles.content}>
                    <ScrollView>
                        <View style={styles.header}>
                            <Text style={styles.title}>{name}</Text>
                            <View style={styles.tags}>
                            {tags.map(tag => <Text key={tag} style={styles.tag}>{tag}</Text>)}
                        </View>
                        </View>
                        <Image style={styles.image} source={{uri: imageUrl}} />
                        <Text style={styles.description}>{description}</Text>
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
                    <Pressable>
                        <View style={styles.a2cButton}>
                            <Text style={styles.a2cText}>
                                Add to cart
                            </Text>
                        </View>
                    </Pressable>
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
        color: rasoiBoxGrey,
        padding: 20,
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
        fontSize: 30
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
    },
    tags: {
        flexDirection: 'row',
    },
    tag: {
        fontSize: 12,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        height: 20,
        marginRight: 10,
        fontFamily: 'AvenirLight',
        backgroundColor: rasoiBoxYellow,
        borderRadius: 10,
        color: 'white',
        marginTop: 5
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
        marginBottom: 10,
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
        marginBottom: 10
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
    }
});