import React, { useCallback, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle
} from "react-native";

import Pagination from "./Pagination";
import Slide from "./Slide";

export interface CarouselItem {
    imageUrl: string
}

function getCarouselStyle(width: number, height: number): StyleProp<ViewStyle> {
    return {
        width: width,
        height: height
    }
}

export default function Carousel(props: {
    carouselData: CarouselItem[],
    width: number,
    height: number
}) {

    const { carouselData, width, height } = props

    const [index, setIndex] = useState(0);
    const indexRef = useRef(index);
    indexRef.current = index;

    const onScroll = useCallback((event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
    
        const distance = Math.abs(roundIndex - index);
    
        // Prevent one pixel triggering setIndex in the middle
        // of the transition. With this we have to scroll a bit
        // more to trigger the index change.
        const isNoMansLand = 0.4 < distance;
    
        if (roundIndex !== indexRef.current && !isNoMansLand) {
          setIndex(roundIndex);
        }
      }, []);

    const flatListOptimizationProps = {
        initialNumToRender: 0,
        maxToRenderPerBatch: 1,
        removeClippedSubviews: true,
        scrollEventThrottle: 16,
        windowSize: 2,
        keyExtractor: useCallback(s => s.imageUrl, []),
        getItemLayout: useCallback(
            (_, index) => ({
                index,
                length: width,
                offset: index * height,
            }), []
        ),
    };

    const renderItem = ({ item }) => {
        return <Slide image={item.imageUrl} title="" subtitle="" width={width} height={height} />
    }

    return (
        <View style={styles.card}>
            <FlatList
                data={carouselData}
                style={getCarouselStyle(width, height)}
                renderItem={renderItem}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={onScroll}
                {...flatListOptimizationProps}
            />
            {carouselData.length > 1 && <Pagination index={index} slideList={[...new Array(carouselData.length)]}/>}
        </View>
      );

}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Dimensions.get('window').width < 700 ? '-2.5%' : '0%',
    },
})