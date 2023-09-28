import { ScrollView, View } from 'react-native';
import Footer from "../common/Footer";
import Header from "../common/Header";
import CookWithConfidence from "./CookWithConfidence";
import HowItWorks from "./HowItWorks";
import InnerChef from "./InnerChef";
import UnlockTheFlavors from "./UnlockTheFlavors";
import WhatIsInARasoiBox from "./WhatIsInARasoiBox";

export default function WelcomePage() {
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView>
                <Header />

                <CookWithConfidence />

                <InnerChef />

                <HowItWorks />

                <WhatIsInARasoiBox />

                {/* <UnlockTheFlavors /> */}

                <Footer />
            </ScrollView>
        </View>
      )
}

