import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AppLoading } from 'expo';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Main from './src/components/Main';
import Login from './src/Login';

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login,
  },
  Main: {
    screen: Main,
  },
});

const AppContainer = createAppContainer(AppNavigator);

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadFonts() {
      await loadFontAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
    }
    loadFonts();
    setFontsLoaded(true);
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <AppContainer />;
};

export default App;
