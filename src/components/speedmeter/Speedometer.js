import React, {useMemo} from 'react';
import {G, Svg} from 'react-native-svg';
import fonts from '../../constants/font';
import SpeedometerContext from './context';
export default function Speedometer({
  width = 350,
  height = 350,
  angle = 250,
  rotation = -angle / 2,
  value = 100,
  min = 0,
  max = 240,
  lineCap = 'butt',
  accentColor = 'blue',
  fontFamily = fonts.Medium,
  children,
}) {
  const radius = width / 2;
  const currentFillAngle = useMemo(() => {
    const clampValue = Math.min(max, Math.max(min, Number(value)));
    return (angle * (clampValue - min)) / (max - min);
  }, [min, max, value, angle]);
  const contextValue = {
    currentFillAngle,
    radius,
    rotation,
    min,
    max,
    angle,
    lineCap,
    accentColor,
    fontFamily,
    value,
  };
  return (
    <SpeedometerContext.Provider value={contextValue}>
      <Svg width={width} height={height}>
        <G rotation={rotation} originX={radius} originY={radius}>
          {children}
        </G>
      </Svg>
    </SpeedometerContext.Provider>
  );
}
