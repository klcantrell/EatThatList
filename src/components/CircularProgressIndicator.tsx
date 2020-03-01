import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { StyleProp, ViewStyle } from 'react-native';

const { interpolate, multiply } = Animated;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  progress: Animated.Node<number>;
  style?: StyleProp<ViewStyle>;
}

const size = 30;
const strokeWidth = 5;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

const CircularProgressIndicator: React.FC<Props> = ({
  progress,
  style = {},
}) => {
  const alpha = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, Math.PI * 2],
  });
  const strokeDashOffset = multiply(alpha, radius);

  return (
    <Svg width={size} height={size} style={style}>
      <AnimatedCircle
        stroke="#CEBBC9"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDashoffset={strokeDashOffset}
        strokeDasharray={`${circumference} ${circumference}`}
      />
    </Svg>
  );
};

export default CircularProgressIndicator;
