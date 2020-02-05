import React from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { Text, View } from 'native-base';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  actionText: string;
  handleRemove: () => void;
}

const SwipeableRow: React.FC<Props> = ({
  children,
  actionText,
  handleRemove,
}) => {
  const intervalId = React.useRef<number>();
  const [isBeingRemoved, setIsBeingRemoved] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);
  const swipeableRow = React.useRef<Swipeable>();

  React.useEffect(() => {
    if (isBeingRemoved && countdown === 3) {
      intervalId.current = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    }
    if (countdown === 0) {
      clearInterval(intervalId.current);
      setIsBeingRemoved(false);
      handleRemove();
      setCountdown(3);
    }
  }, [isBeingRemoved, countdown]);

  const onSwipeLeft = () => {
    setIsBeingRemoved(true);
  };

  const renderLeftActions = progress => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-Dimensions.get('screen').width, 0],
    });
    return (
      <View style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton style={styles.leftAction}>
            {isBeingRemoved && (
              <Text style={styles.countdownText}>{countdown}</Text>
            )}
            <Text style={styles.actionText}>{actionText}</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      leftThreshold={30}
      renderLeftActions={renderLeftActions}
      onSwipeableLeftOpen={onSwipeLeft}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C97AFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: 'white',
    fontSize: 30,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default SwipeableRow;
