import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

function Index() {
    const width = Dimensions.get('window').width / 2;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

export default Index;
