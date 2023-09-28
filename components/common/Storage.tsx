import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthDetails } from "./AuthShim";

export const ACCESS_TOKEN = "access_token"
export const USER_CODE = "user_code"
const AUTH_DETAILS = "auth_details"

export async function storeAuthDetails(authDetails: AuthDetails): Promise<void> {
    try {
        const jsonValue = JSON.stringify(authDetails);
        await AsyncStorage.setItem(AUTH_DETAILS, jsonValue);
    } catch (e) {
        console.error(e);
    }
}

export async function getAuthDetails(): Promise<AuthDetails | null> {
    return await AsyncStorage.getItem(AUTH_DETAILS).then(jsonValue => {
        return jsonValue != null ? JSON.parse(jsonValue) as AuthDetails : null;
    }).catch(e => {
        console.error(e);
        return null;
    });
}

export async function signout(): Promise<void> {
    getAuthDetails().then(oldAuthDetails => {
        let newAuthDetails: AuthDetails = {
            authenticated: false
        }

        if (oldAuthDetails) {
            newAuthDetails = {
                ...newAuthDetails,
                verification_code: oldAuthDetails.verification_code
            }
        }

        storeAuthDetails(newAuthDetails).then(async () => {
            return await AsyncStorage.removeItem(ACCESS_TOKEN).then(() => {})
                .catch(error => {
                    console.error(error);
                    return;
                })
        }).catch(error => {
            console.error(error);
            return;
        })
    })
}

export async function removeAuthDetails(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_DETAILS).then(async () => {
        return await AsyncStorage.removeItem(ACCESS_TOKEN).then(() => { return; }).catch(e => {
            console.error(e);
            return;
        })
    }).catch(e => {
        console.error(e);
        return;
    });
}
