import React, { useState } from "react";
import AlbumList from "./AlbumList";
import PhotoGallery from "./PhotoGallery";
import '../styles/index.css'; 


function Gallery() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  return (
    <div className="gallery-page">
      {!isModalOpen ? (
        <>
          <h1>Photo Gallery</h1>
          <AlbumList onAlbumClick={handleAlbumClick} />
        </>
      ) : (
        <PhotoGallery
          album={selectedAlbum}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAlbum(null);
          }}
        />
      )}
    </div>
  );
}

export default Gallery;
