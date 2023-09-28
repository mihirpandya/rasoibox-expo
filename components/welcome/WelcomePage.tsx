import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AuthDetails } from '../common/AuthShim';
import Footer from "../common/Footer";
import Header from "../common/Header";
import * as Storage from "../common/Storage";
import CookWithConfidence from "./CookWithConfidence";
import HowItWorks from "./HowItWorks";
import InnerChef from "./InnerChef";
import UnlockTheFlavors from "./UnlockTheFlavors";
import WhatIsInARasoiBox from "./WhatIsInARasoiBox";
import { generateCode } from '../../constants/utils';


export default function WelcomePage() {
    
    function setVerificationCode() {
        Storage.getAuthDetails().then(async authDetails => {
            let code: string | undefined = authDetails?.verification_code
            if (!code) {
                code = generateCode()
                let newAuthDetails: AuthDetails
                if (authDetails) {
                    newAuthDetails = {
                        ...authDetails,
                        verification_code: code
                    }
                } else {
                    newAuthDetails = {
                        authenticated: false,
                        verification_code: code
                    }
                }
                await Storage.storeAuthDetails(newAuthDetails)
            }
        })
    }

    useEffect(() => {
        setVerificationCode()
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView>
                <Header />

                <CookWithConfidence />

                <InnerChef />

                <HowItWorks />

                <WhatIsInARasoiBox />

                <UnlockTheFlavors />

                <Footer />
            </ScrollView>
        </View>
      )
}

