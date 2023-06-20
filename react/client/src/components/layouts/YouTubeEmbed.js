import React, { useRef, useEffect } from 'react';

const YouTubeEmbed = ({
  videoId,
  width,
  height,
  resolution = 'hd720',
}) => {
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const iframe = document.createElement('iframe');

    // Create a container for the iframe to handle scaling
    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'relative';
    iframeContainer.style.overflow = 'hidden';
    iframeContainer.style.width = '100%';
    iframeContainer.style.paddingTop = '56.25%'; // For 16:9 aspect ratio


    // Set iframe attributes
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&controls=1&fs=1&autohide=2&showinfo=0&hd=${resolution}`;
    iframe.title = 'YouTube Video Player';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';


    // Clean the videoContainer and append new elements
    videoContainer.innerHTML = '';
    iframeContainer.appendChild(iframe); // Append iframe to iframeContainer
    videoContainer.appendChild(iframeContainer); // Append iframeContainer to videoContainer


    return () => {
      videoContainer.innerHTML = '';
    };
  }, [videoId, width, height, resolution]);

  return <div ref={videoContainerRef} />;
};

export default YouTubeEmbed;
