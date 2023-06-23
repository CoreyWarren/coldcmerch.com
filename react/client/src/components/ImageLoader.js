import React, { useState, useEffect } from 'react';

const ImageLoader = ({thumbnail, full}) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const image = new Image();
    image.src = full;
    image.onload = () => setLoaded(true);
  }, [full]);


  
  return (
    <img
      className={`image-loader ${loaded ? 'loaded' : ''}`}
      src={loaded ? full : thumbnail}
      alt='loaded content'
    />
  );
};

export default ImageLoader;
