import React, { useContext, useState } from "react";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { SongContext } from "../Context/SongContext";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";
import { SlOptionsVertical } from "react-icons/sl";
import { MdDeleteOutline, MdOutlinePlaylistAdd, MdQueuePlayNext } from 'react-icons/md';
import musicbg from "../assets/musicbg.jpg";

const SongCard = ({ title, artistName, songSrc, userId, songId, file, coverImage }) => {
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchSong } = useContext(FetchContext);
  const { dispatchQueue, dispatchList } = useContext(QueueContext);
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const token = localStorage.getItem("access_token");
  let decoded;
  if (token) { decoded = decodeToken(token) }

  const handlePlay = () => {
    song.setSongName(title);
    song.setArtistName(artistName);
    song.setSongUrl(`${__URL__}/api/v1/stream/${songSrc}`);
    audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
    audio.load();
    audio.play();
    song.setIsPlaying(true);
  };

  const displayOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const deleteSong = async () => {
    try {
      const { status } = await axios.delete(
        `${__URL__}/api/v1/song/delete/${songId}?file=${file}`,
        { headers: { "x-auth-token": token } }
      );
      if (status === 200) setFetchSong(prev => !prev);
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      deleteSong();
    }
  };

  const handleAddToPlaylist = () => {
    dispatchList({ type: 'ADD_SONG', payload: { title, artistName, songSrc } });
    navigate("/playlists");
  };

  const handlePlayNext = () => {
    dispatchQueue({ type: 'ADD_TO_QUEUE', payload: { title, artistName, songSrc } });
  };

  return (
    <div className="flex relative bg-gray-800 text-white justify-between items-center border-b-[1px] p-2 lg:w-[70vw] mx-auto hover:bg-gray-700 transition-colors">
      <div onClick={handlePlay} className="flex space-x-5 cursor-pointer">
        <img 
          src={coverImage || musicbg} 
          alt={`${title} cover`} 
          className="w-16 h-16 object-cover rounded-md shadow-md hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.log(`Image load error for: ${title}`);
            e.target.onerror = null;
            e.target.src = musicbg;
          }}
        />
        <div className="text-sm lg:text-lg flex flex-col justify-center">
          <div className="font-semibold">{title}</div>
          <div className="text-gray-400">{artistName}</div>
        </div>
      </div>

      {/* Desktop Options */}
      <div className="hidden lg:flex justify-start items-center p-2 space-x-5">
        <button 
          onClick={handleAddToPlaylist}
          className="hover:scale-110 transition-transform"
          title="Add to playlist"
        >
          <MdOutlinePlaylistAdd size={30}/>
        </button>
        <button 
          onClick={handlePlayNext}
          className="hover:scale-110 transition-transform"
          title="Play next"
        >
          <MdQueuePlayNext size={25}/>
        </button>
        {decoded && decoded.id === userId && (
          <button 
            onClick={handleDelete} 
            className="hover:scale-110 transition-transform text-red-400 hover:text-red-500"
            title="Delete song"
          >
            <MdDeleteOutline size={25}/>
          </button>
        )}
      </div>

      {/* Mobile Options */}
      <div className="relative block lg:hidden">
        <button
          onClick={displayOptions}
          className="p-2 hover:bg-gray-700 rounded-full"
          onBlur={() => setTimeout(() => setShowOptions(false), 200)}
        >
          <SlOptionsVertical size={15} />
        </button>
        {showOptions && (
          <div className="absolute right-0 top-full z-10 w-36 bg-gray-900 rounded-md shadow-lg">
            <ul className="flex justify-start flex-col items-start space-y-2 p-2">
              <button 
                onClick={handleAddToPlaylist}
                className="w-full text-left hover:bg-gray-800 p-2 rounded"
              >
                Add to playlist
              </button>
              <button 
                onClick={handlePlayNext}
                className="w-full text-left hover:bg-gray-800 p-2 rounded"
              >
                Play next
              </button>
              {decoded && decoded.id === userId && (
                <button 
                  onClick={handleDelete} 
                  className="w-full text-left hover:bg-gray-800 p-2 rounded text-red-400 hover:text-red-500"
                >
                  Delete
                </button>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;