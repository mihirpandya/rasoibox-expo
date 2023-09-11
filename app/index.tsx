import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AuthShim from "../components/common/AuthShim";
import * as Storage from "../components/common/Storage";
import WelcomePage from '../components/welcome/WelcomePage';
import { isAuthenticated } from './api/rasoibox-backend';

interface AuthenticationDetails {
  authenticated: boolean
}

export default function Index() {

    const [authDetails, setAuthDetails] = useState<AuthenticationDetails>()

    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem(Storage.ACCESS_TOKEN);
        return value;
      } catch (e) {
        return null;
      }
    }

    const fetchIsAuthenticated = () => {
        let authDetails: AuthenticationDetails;
        getToken().then(async token => {
          if (token == null || token == undefined) {
            authDetails = {
              authenticated: false
            }
          } else {
            authDetails = await isAuthenticated(token)
          }
        }).catch(error => {
          console.error(error);
          authDetails = {
            authenticated: false
          }
        }).finally(() => {
          setAuthDetails(authDetails);
        })
      }
    
      useEffect(() => {
          fetchIsAuthenticated()
        }, [])

        return (
        <AuthShim authChild={<Redirect href="/menu" />} unauthChild={<WelcomePage />}/>
        );
}

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    },
    logo: {
        width: 200,
        height: 50
    },
    footer: {
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'     
    },
    body: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 100,
        paddingLeft: '20%',
        paddingRight: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slogan: {
        fontSize: 40,
        fontFamily: 'CormorantGaramondSemiBold',
        textAlign: 'center',
    },
    header: {
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center' 
    },
    button: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#f9a66c',
        fontSize: 20,
        fontFamily: 'AvenirLight',
    },
  });