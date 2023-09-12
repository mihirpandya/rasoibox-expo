import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthDetails } from "./AuthShim";

export const ACCESS_TOKEN = "access_token"
const AUTH_DETAILS = "auth_details"

export async function storeAuthDetails(authDetails: AuthDetails) {
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