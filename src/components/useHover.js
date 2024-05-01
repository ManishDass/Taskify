import { useState } from 'react';

const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    console.log("hovered")
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log("not hovered")
    setIsHovered(false);
  };

  return [isHovered, handleMouseEnter, handleMouseLeave];
};

export default useHover;
