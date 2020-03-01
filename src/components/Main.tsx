import React from 'react';
import AvailableLists from './AvailableLists';
import { NavigationStackProp } from 'react-navigation-stack';

interface Props {
  navigation: NavigationStackProp;
}

const Main: React.FC<Props> = ({ navigation }) => {
  return <AvailableLists navigation={navigation} />;
};

export default Main;
