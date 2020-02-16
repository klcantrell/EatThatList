import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Main from './Main';
import Login from './Login';
import SelectedList from './SelectedList';
import AvailableLists from './AvailableLists';

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
