import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { isAuthenticated } from './api/rasoibox-backend';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    CormorantGaramondSemiBold: require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
    AvenirLight: require('../assets/fonts/Avenir-Light.ttf'),
    ...FontAwesome.font,
  });

  const [authDetails, setAuthDetails] = useState([])

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("access_token");
      return value;
    } catch (e) {
      return null;
    }
  }

  const fetchIsAuthenticated = () => {
    let authDetails: any;
    getToken().then(token => {
      if (token == null || token == undefined) {
        console.log("never logged in");
        authDetails = {
          "authenticated": false
        }
      } else {
        isAuthenticated(token).then(response => {
          console.log(response);
          authDetails = response
        })
      }
    }).catch(error => {
      console.error(error);
      authDetails = {
        "authenticated": false
      }
    }).finally(() => {
      setAuthDetails(authDetails);
    })
  }

  useEffect(() => {
      fetchIsAuthenticated()
    }, [])

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Stack />
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 50
  },
  header: {
    backgroundColor: 'white',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center' 
  }
});
