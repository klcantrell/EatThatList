import React, { FunctionComponent } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { Text, View } from 'native-base';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  actionText: string;
}

const SwipeableRow: FunctionComponent<Props> = ({ children, actionText }) => {
  const swipeableRow = React.useRef<Swipeable>();

  const renderLeftActions = progress => {
    const pressHandler = () => {
      close();
      alert(actionText);
    };
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-Dimensions.get('screen').width, 0],
    });
    return (
      <View style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton style={styles.leftAction} onPress={pressHandler}>
            <Text style={styles.actionText}>{actionText}</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };
  const close = () => {
    swipeableRow.current && swipeableRow.current.close();
  };
  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      leftThreshold={30}
      renderLeftActions={renderLeftActions}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#C97AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
    marginLeft: 'auto',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default SwipeableRow;
