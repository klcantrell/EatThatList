import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon, View, Text } from 'native-base';
import Main from './Main';
import Login from './Login';
import SelectedList from './SelectedList';
import AvailableLists from './AvailableLists';
import ListSettings from './ListSettings';

const SelectedListWithSettings = createBottomTabNavigator(
  {
    List: {
      screen: SelectedList,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <View style={styles.tab}>
            <Icon
              style={[styles.icon, { color: focused ? 'blue' : 'black' }]}
              name="list"
            />
            <Text style={styles.label}>List</Text>
          </View>
        ),
      },
    },
    Settings: {
      screen: ListSettings,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <View style={styles.tab}>
            <Icon
              style={[styles.icon, { color: focused ? 'blue' : 'black' }]}
              name="cog"
            />
            <Text style={styles.label}>Settings</Text>
          </View>
        ),
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        height: 45,
      },
      keyboardHidesTabBar: false,
    },
  }
);

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
    screen: SelectedListWithSettings,
    navigationOptions: () => ({ headerShown: false }),
  },
});

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    paddingBottom: 3,
  },
});

export default createAppContainer(AppNavigator);
