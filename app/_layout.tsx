import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme, Image, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Themed';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
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

  return <RootLayoutNav />;
}

function LogoTitle() {
  return (
    <View style={{paddingLeft: '20%'}}>
      <Image
        style={styles.logo}
        source={{ uri: '../assets/images/header_logo.svg' }}
      />
    </View>
  );
}

function MenuOptions() {
  return (
    <View style={styles.menuOptions}>
      <Text style={styles.menuItem}>Menu</Text>
      <Text style={styles.menuItem}>About Us</Text>
    </View>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: _props => <LogoTitle />,
          headerRight: _props => <MenuOptions />
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 225,
    height: 50
  },
  menuOptions: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: '10%',
  },
  menuItem: {
    padding: 20,
    fontFamily: 'AvenirLight',
    fontSize: 15,
  }
});
