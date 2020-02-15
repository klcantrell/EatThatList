import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button, Icon } from 'native-base';

interface Props {
  onPress: () => void;
  color: string;
  icon: string;
  style?: StyleProp<ViewStyle>;
}

const Fab: React.FC<Props> = ({ onPress, icon, color, style }) => (
  <Button
    rounded
    style={[styles.fabBtn, { backgroundColor: color }, style]}
    onPress={onPress}
  >
    <Icon name={icon} />
  </Button>
);

const styles = StyleSheet.create({
  fabBtn: {
    justifyContent: 'center',
    width: 50,
    height: 50,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 3,
  },
});

export default Fab;
