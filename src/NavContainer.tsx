import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Main from './components/Main';
import Login from './components/Login';
import SelectedList from './components/SelectedList';
import AvailableLists from './components/AvailableLists';

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

export default createAppContainer(AppNavigator);
