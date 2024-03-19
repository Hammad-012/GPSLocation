import React, {useContext} from 'react';
import {Circle, G, Polygon} from 'react-native-svg';
import Context from './context';
export default function Needle({
  offset = 45,
  baseWidth = 6,
  baseOffset = 18,
  color = 'white',
  circleRadius = 12,

  strokeLinejoin = 'round',
  children,
}) {
  const {currentFillAngle, radius} = useContext(Context);
  const bottom = radius + baseOffset;
  const points = `
    ${radius - baseWidth / 2}, ${bottom} ${
    radius + baseWidth / 2
  }, ${bottom} ${radius}, ${offset}
  `;
  const defaultNeedle = (
    <G>
      <Circle r={circleRadius} cx={radius} cy={radius} fill={color} />
      <Polygon
        points={points}
        fill={color}
        strokeWidth="2"
        stroke={color}
        strokeLinejoin={strokeLinejoin}
      />
    </G>
  );
  return (
    <G transform={`rotate(${currentFillAngle}, ${radius}, ${radius})`}>
      {children ? children() : defaultNeedle}
    </G>
  );
}
