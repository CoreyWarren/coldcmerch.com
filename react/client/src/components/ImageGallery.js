import React, { useState, useEffect } from 'react';
import ImageLoader from './ImageLoader';

const ImageGallery = ({title, gallery, type_original, type_thumbnail, credit}) => {
  const [images, setImages] = useState([]);

    gallery = String(gallery);
    type_original = String(type_original);
    type_thumbnail = String(type_thumbnail);


  const loadImages = async (gallery_load, img_type) => {
    const images = [];
    try{
        for (let i = 1; i <= 9; i++) {
            const paddedIndex = String(i).padStart(3, '0');
            const image = await import(`../assets/${gallery_load}/${paddedIndex}${img_type}.jpg`);
            images.push(image.default);
        }
    } catch (err) {
        console.log(err);
    }

    return images;
  };

  useEffect(() => {
    const loadAllImages = async () => {
      const thumbnails = await loadImages(gallery, type_thumbnail);
      const fulls = await loadImages(gallery, type_original);
      const imageList = thumbnails.map((thumbnail, index) => ({
        thumbnail,
        full: fulls[index],
      }));
      setImages(imageList);
    };
    
    loadAllImages();
  }, []);



  return (
    <div className="image-gallery">
        <h3>{title}</h3>
      {images.map((image, index) => (
        <ImageLoader
          key={index}
          thumbnail={image.thumbnail}
          full={image.full}
        />
      ))}
      <p>{credit}</p>
    </div>
  );
};

export default ImageGallery;
