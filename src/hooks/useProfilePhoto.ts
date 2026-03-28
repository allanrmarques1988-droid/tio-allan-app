import { useState, useEffect } from 'react';

export const useProfilePhoto = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('profile_photo');
    if (savedPhoto) {
      setPhoto(savedPhoto);
    } else {
      // Default placeholder that looks like a profile
      setPhoto('https://picsum.photos/seed/allan/400/400');
    }
  }, []);

  const updatePhoto = (newPhoto: string) => {
    setPhoto(newPhoto);
    localStorage.setItem('profile_photo', newPhoto);
  };

  const removePhoto = () => {
    setPhoto(null);
    localStorage.removeItem('profile_photo');
  };

  return { photo, updatePhoto, removePhoto };
};
