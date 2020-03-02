import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { logoPath } from '../common/constants';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  color?: string;
  scale?: number;
}

const Logo: React.FC<Props> = ({ style = {}, color = '#000', scale = 1 }) => {
  return (
    <Svg
      width={65}
      height={60}
      viewBox="113 94 80 80"
      style={[
        {
          transform: [{ rotateY: '180deg' }, { scale }],
        },
        style,
      ]}
    >
      <Path d={logoPath} scale={0.5} fill={color} />
    </Svg>
  );
};

export default Logo;
