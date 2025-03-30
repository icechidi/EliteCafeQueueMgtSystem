import React, { useState } from 'react';
import placeholderImage from '../assets/placeholder.svg';

const MenuItem = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return `₺${price.toFixed(2)}`;
  };

  return (
    <div>
      <img 
        src={imageError ? placeholderImage : item.image}
        onError={() => setImageError(true)}
        alt={item.name}
      />
      <p>{formatPrice(item.price)}</p>
    </div>
  );
};

export default MenuItem; 