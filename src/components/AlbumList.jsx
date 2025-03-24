import React from "react";
import { albums } from "../Albums";

function AlbumList({ onAlbumClick }) {
  return (
    <div className="album-list">
      {albums.map((album) => (
        <div
          key={album.id}
          className="album"
          onClick={() => onAlbumClick(album)}
        >
          <img src={album.coverImage} alt={album.name} className="album-cover" />
          <p>{album.name}</p>
        </div>
      ))}
    </div>
  );
}

export default AlbumList;
