import React, {useEffect, useState} from 'react';
const useCountdown = ({start}) => {
  const [countDown, setCountDown] = useState(0);

  let interval = null;
  useEffect(() => {
    if (start) {
      interval = setInterval(() => {
        setCountDown(countDown => countDown + 60);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countDown, start]);

  return [getReturnValues(countDown), setCountDown];
};
const getReturnValues = value => {
  const hours = Math.floor(value / (60 * 60));

  const minutes = parseInt(Math.floor(value / 60) % 60);
  let my_hours = `0${hours}`.slice(-2);
  let my_minuites = `0${minutes}`.slice(-2);
  return `${my_hours}:${my_minuites}`;
};

export {useCountdown};
