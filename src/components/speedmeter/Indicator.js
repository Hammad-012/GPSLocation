import React, {useContext} from 'react';
import {Text} from 'react-native-svg';
import fonts from '../../constants/font';
import Context from './context';
export default function Indicator({
  fontSize =10,
  color = 'white',
  fontFamily,
  textAnchor = 'middle',
  fixValue = true,
  children,
  ...rest
}) {
  const {
    value,
    radius,
    rotation,
    fontFamily: globalFontFamily,
  } = useContext(Context);
  const textProps = {
    transform: `rotate(${360 - rotation}, ${radius}, ${radius})`,
  };
  const fixedValue = fixValue ? Number(value).toFixed() : value.toString();
  if (children) return children(fixedValue, textProps);
  return (
    <Text
      {...textProps}
      x={radius}
      y={radius + radius / 2 + 10}
      textAnchor={textAnchor}
      fontSize={fontSize}
      fontFamily={fonts.Medium}
      fill={color}
      {...rest}>
      {fixedValue}
    </Text>
  );
}
