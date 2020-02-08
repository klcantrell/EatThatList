import React from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import { Text } from 'native-base';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  actionText: string;
  handleRemove: (num: number) => void;
  id: number;
}

enum Visibility {
  Visible,
  Removing,
  Hidden,
}

const SwipeableRow: React.FC<Props> = ({
  children,
  actionText,
  handleRemove,
  id,
}) => {
  const [visibility, setVisibility] = React.useState(Visibility.Visible);
  const [countdown, setCountdown] = React.useState(3);
  const swipeableRow = React.useRef<Swipeable>();
  const intervalId = React.useRef<NodeJS.Timeout>();
  const animatedY = React.useRef<Animated.Value>(new Animated.Value(1));

  React.useEffect(() => {
    if (visibility === Visibility.Removing && countdown === 3) {
      intervalId.current = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    }
    if (countdown === 0) {
      clearInterval(intervalId.current);
      setVisibility(Visibility.Hidden);
      setCountdown(3);
      setTimeout(() => {
        handleRemove(id);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      }, 70);
      Animated.spring(animatedY.current, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visibility, countdown]);

  const onSwipeLeft = () => {
    setVisibility(Visibility.Removing);
  };

  const renderLeftActions = progress => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-Dimensions.get('screen').width, 0],
    });
    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: trans }, { scaleY: animatedY.current }],
        }}
      >
        <RectButton style={styles.leftAction}>
          {visibility === Visibility.Removing && (
            <Text style={styles.countdownText}>{countdown}</Text>
          )}
          <Text style={styles.actionText}>{actionText}</Text>
        </RectButton>
      </Animated.View>
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
      <Animated.View style={{ transform: [{ scaleY: animatedY.current }] }}>
        {children}
      </Animated.View>
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
