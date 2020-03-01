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
import ReAnimated, { Easing } from 'react-native-reanimated';
import CircularProgressIndicator from './CircularProgressIndicator';
import { runTiming } from '../common/animations';

const { Clock } = ReAnimated;

const REMOVE_ITEM_TIMEOUT = 3000;

interface Props {
  actionText: string;
  handleRemove: (num: number) => void;
  id: number;
}

enum Visibility {
  Visible,
  Removing,
  Removed,
}

const SwipeableRow: React.FC<Props> = ({
  children,
  actionText,
  handleRemove,
  id,
}) => {
  const [visibility, setVisibility] = React.useState(Visibility.Visible);
  const swipeableRow = React.useRef<Swipeable>();
  const timeoutId = React.useRef<number>(null);
  const animatedY = React.useRef<Animated.Value>(new Animated.Value(1));

  React.useEffect(() => {
    if (visibility === Visibility.Removing && !timeoutId.current) {
      timeoutId.current = setTimeout(() => {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
        setVisibility(Visibility.Removed);
        setTimeout(() => {
          handleRemove(id);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        }, 70);
        Animated.spring(animatedY.current, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }, REMOVE_ITEM_TIMEOUT);
    }
  }, [visibility]);

  const onSwipeLeft = () => {
    setVisibility(Visibility.Removing);
  };

  const cancelRemove = (callback: () => void = () => {}) => {
    clearTimeout(timeoutId.current);
    timeoutId.current = null;
    setVisibility(Visibility.Visible);
    callback();
  };

  const renderLeftActions = progress => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-Dimensions.get('screen').width, 0],
    });
    const circularProgress = runTiming(
      REMOVE_ITEM_TIMEOUT,
      new Clock(),
      0,
      1,
      Easing.linear
    );
    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: trans }, { scaleY: animatedY.current }],
        }}
      >
        <RectButton
          style={styles.leftAction}
          onPress={() => cancelRemove(swipeableRow.current.close)}
        >
          {visibility === Visibility.Removing && (
            <CircularProgressIndicator progress={circularProgress} />
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
      onSwipeableClose={cancelRemove}
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
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    padding: 10,
    marginLeft: 10,
  },
});

export default SwipeableRow;
