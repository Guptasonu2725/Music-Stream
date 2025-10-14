import React, { useContext } from "react";
import axios from 'axios';
import { SongContext } from "../Context/SongContext";
import { FetchContext } from "../Context/FetchContext";
import { CgRemoveR } from 'react-icons/cg';
import musicbg from "../assets/musicbg.jpg";

const PlaylilstSong = ({ title, artistName, songSrc, playlistId, coverImage }) => {
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchPlaylist } = useContext(FetchContext);

  const handlePlay = async () => {
    try {
      if (audio) {
        audio.pause();
        song.setSongName(title);
        song.setArtistName(artistName);
        song.setSongUrl(`${__URL__}/api/v1/stream/${songSrc}`);
        audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
        await audio.load();
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              song.setIsPlaying(true);
            })
            .catch(error => {
              console.error("Error playing song:", error);
            });
        }
      }
    } catch (error) {
      console.error("Error in handlePlay:", error);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this song from playlist?')) {
      try {
        const { status } = await axios.delete(
          `${__URL__}/api/v1/playlist/remove/${playlistId}?song=${title}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("access_token")
            }
          }
        );

        if (status === 200) {
          setFetchPlaylist(prev => !prev);
        }
      } catch (error) {
        console.error("Error removing song:", error);
        alert('Failed to remove song from playlist');
      }
    }
  };

  return (
    <div className="flex relative bg-gray-800 text-white justify-between items-center border-b-[1px] p-2 lg:w-[70vw] mx-auto hover:bg-gray-700 transition-all duration-300">
      <div onClick={handlePlay} className="flex space-x-5 cursor-pointer flex-1">
        <img 
          src={coverImage || musicbg} 
          alt={`${title} cover`} 
          className="w-16 h-16 object-cover rounded-md shadow-md hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.log('Image load error for:', title);
            e.target.onerror = null;
            e.target.src = musicbg;
          }}
        />
        <div className="flex flex-col justify-center">
          <div className="text-sm lg:text-lg font-semibold">{title}</div>
          <div className="text-sm lg:text-base text-gray-400">{artistName}</div>
        </div>
      </div>

      <button
        onClick={handleRemove}
        className="p-2 hover:bg-gray-600 rounded-full transition-colors duration-300"
        title="Remove from playlist"
        aria-label={`Remove ${title} from playlist`}
      >
        <CgRemoveR size={25} className="text-red-400 hover:text-red-500" />
      </button>
    </div>
  );
};

export default PlaylilstSong;