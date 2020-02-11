import React from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import AvailableLists from './AvailableLists';
import { NavigationStackProp } from 'react-navigation-stack';

interface Props {
  navigation: NavigationStackProp;
}

const Main: React.FC<Props> = ({ navigation }) => {
  return (
    <Container style={styles.container}>
      <AvailableLists navigation={navigation} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});

export default Main;
