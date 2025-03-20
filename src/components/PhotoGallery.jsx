import React from "react";
import { useState } from "react";

function PhotoGallery({ album, onClose }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!album || !album.photos.length) return null;

  return (
    <div className="gallery-modal">
      <div className="gallery-close" onClick={onClose}>
        ✕
      </div>
      <h2 className="gallery-title">{album.title}</h2>
      
      {/* Navigation */}
      <button
        onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + album.photos.length) % album.photos.length)}
        className="gallery-nav gallery-prev"
      >
        ←
      </button>

      <img
        src={album.photos[currentPhotoIndex].src}
        alt={album.photos[currentPhotoIndex].alt}
        className="gallery-image"
      />

      <button
        onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % album.photos.length)}
        className="gallery-nav gallery-next"
      >
        →
      </button>

      {/* Photo Details */}
      <div className="photo-info">
        <h3>{album.photos[currentPhotoIndex].title || "Untitled"}</h3>
        <p>{album.photos[currentPhotoIndex].description || "No description"}</p>
      </div>
    </div>
  );
}

export default PhotoGallery;