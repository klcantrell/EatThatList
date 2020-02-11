import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AppLoading } from 'expo';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Main from './src/components/Main';
import Login from './src/components/Login';
import SelectedList from './src/components/SelectedList';
import AvailableLists from './src/components/AvailableLists';

const firebaseConfig = {
  apiKey: 'AIzaSyAPkyMJpeZhgil9LCtTBoz7JMOimpF2764',
  authDomain: 'eatthatlist.firebaseapp.com',
  databaseURL: 'https://eatthatlist.firebaseio.com',
  projectId: 'eatthatlist',
  storageBucket: 'eatthatlist.appspot.com',
  messagingSenderId: '927915290820',
  appId: '1:927915290820:web:5d41e7c65597efe80ad991',
};

firebase.initializeApp(firebaseConfig);

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: () => ({ headerShown: false }),
  },
  Main: {
    screen: Main,
    navigationOptions: () => ({ headerShown: false }),
  },
  AvailableLists: {
    screen: AvailableLists,
    navigationOptions: () => ({ headerShown: false }),
  },
  SelectedList: {
    screen: SelectedList,
    navigationOptions: () => ({ headerShown: false }),
  },
});

const AppContainer = createAppContainer(AppNavigator);

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadFonts = async () => {
      await loadFontAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
    };
    loadFonts();
    setFontsLoaded(true);
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <AppContainer />;
};

export default App;
