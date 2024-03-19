import React, {useContext, useMemo} from 'react';
import {Path} from 'react-native-svg';
import Context from './context';
import {getCirclePath} from './utils';
export default function Background({
  angle = 350,
  color = '#0001',
  opacity = 1,
  ...rest
}) {
  const {rotation, radius} = useContext(Context);
  const backgroundStart = rotation + angle / 2;
  const backgroundPath = useMemo(
    () =>
      getCirclePath(
        radius,
        radius,
        radius,
        -backgroundStart,
        -backgroundStart + angle,
      ),
    [radius, backgroundStart, angle],
  );
  return (
    <Path
      d={backgroundPath}
      fill={color}
      strokeWidth={2}
      strokeLinejoin={'round'}
      fillOpacity={opacity}
      {...rest}
    />
  );
}
