import Animated from 'react-native-reanimated';

const {
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  stopClock,
  block,
} = Animated;

const runTiming = (
  duration: number,
  clock: Animated.Clock,
  value: number,
  dest: number,
  easing: Animated.EasingFunction
) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration,
    toValue: new Value(0),
    easing,
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ]
    ),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

export { runTiming };
