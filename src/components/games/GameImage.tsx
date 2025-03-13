'use client';

import { useState } from 'react';

interface GameImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function GameImage({ src, alt, className = '' }: GameImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc('/images/placeholder.jpg');
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
    />
  );
} 