import React from "react";
import { albums } from "../../public/assets/Albums";

function AlbumList({ setSelectedAlbum }) {
  return (
    <div className="album-list">
      {albums.map((album) => (
        <div
          key={album.id}
          className="album-item"
          onClick={() => setSelectedAlbum(album)}
        >
          <img src={album.coverImage} alt={album.title} className="album-cover" />
          <h3 className="album-title">{album.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default AlbumList;