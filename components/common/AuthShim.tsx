import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { isAuthenticated } from "../../app/api/rasoibox-backend";
import * as Storage from "./Storage";
import { ActivityIndicator } from 'react-native';
import { rasoiBoxPink } from '../../constants/Colors';

interface IAuthShimProps {
    authChild: React.ReactNode;
    unauthChild: React.ReactNode;
}

export interface AuthDetails {
    authenticated: boolean,
    first_name?: string,
    last_name?: string,
    email?: string,
    verification_code?: string
}

export default function AuthShim(props: IAuthShimProps) {
    const { authChild, unauthChild } = props;
    const [authDetails, setAuthDetails] = useState<AuthDetails>()

    function fetchIsAuthenticated() {
        let authDetails: AuthDetails
        AsyncStorage.getItem(Storage.ACCESS_TOKEN).then(async token => {
            authDetails = await isAuthenticated(token)
        }).catch(error => {
            console.error(error);
            authDetails = {
                authenticated: false
            }
        }).finally(async () => {
            setAuthDetails(authDetails)
            Storage.getAuthDetails().then(async oldAuthDetails => {
                let newAuthDetails: AuthDetails
                if (oldAuthDetails) {
                    newAuthDetails = {
                        ...oldAuthDetails,
                        ...authDetails
                    }
                } else {
                    newAuthDetails = {
                        ...authDetails
                    }
                }
                await Storage.storeAuthDetails(newAuthDetails)
            })
            await Storage.storeAuthDetails(authDetails);
        })
    }

    useEffect(() => {
        fetchIsAuthenticated()
      }, [])

    if (authDetails == undefined) {
        return (
            <ActivityIndicator color={rasoiBoxPink} size="large" />
        )
    } else if (authDetails?.authenticated) {
        return authChild;
    } else {
        return unauthChild;
    }
}