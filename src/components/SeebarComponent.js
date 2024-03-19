import { useState } from 'react';
import { Seekbar } from 'react-seekbar';

export default function SeekBar() {
  const [position, setPosition] = useState(0);

  const handleSeek = (position) => {
    setPosition(position);
  };

  return <Seekbar position={position} duration={100000} onSeek={handleSeek} />;
}