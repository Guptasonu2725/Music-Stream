import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import PlaylilstSong from "../components/PlaylilstSong";
import { MdDeleteForever } from "react-icons/md";

// Import Saiyaara playlist images
import saiyaaraImage from "../assets/Saiyaara-playlist.jpeg";
import tumHoTohImage from "../assets/Tum ho Toh.webp";
import humsafarImage from "../assets/Humsafar.jpg";
import dhunImage from "../assets/Dhun.jpg";
import barbaadImage from "../assets/Barbaad.jpg";
import barbaadRepriseImage from "../assets/Barbaad-reprise.jpg";

// Import Maalik playlist images
import maalikImage from "../assets/Maalik.webp";
import affairImage from "../assets/Affair.jpg";
import dilThaamKeImage from "../assets/Dil-Thaam-Ke.jpg";
import naamumkinImage from "../assets/Naamumkin.jpg";
import raajKaregaImage from "../assets/Raaj Karega Maalik.jpg";

// Default image
import musicbg from "../assets/musicbg.jpg";

// Updated song mappings for both playlists
const PLAYLIST_SONGS = {
  'Saiyaara': {
    'Saiyaara': saiyaaraImage,
    'Barbaad': barbaadImage,
    'Tum Ho Toh': tumHoTohImage,
    'Humsafar': humsafarImage,
    'Dhun': dhunImage,
    'Barbaad Reprise Female': barbaadRepriseImage
  },
  'Maalik': {
    'Affair': affairImage,
    'Dil Thaam Ke': dilThaamKeImage,
    'Naamumkin': naamumkinImage,
    'Raaj Karega Maalik': raajKaregaImage,
    'Maalik': maalikImage
  }
};

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playList, setPlayList] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchPlaylist } = useContext(FetchContext);
  const { __URL__ } = useContext(SongContext);

  // Updated getSongImage function to handle both playlists
  const getSongImage = (title) => {
    console.log('Getting image for song:', title);

    // Get current playlist's songs
    const currentPlaylistSongs = PLAYLIST_SONGS[playList.playlistName] || {};

    // Try exact match first
    if (currentPlaylistSongs[title]) {
      console.log('Found exact match for:', title);
      return currentPlaylistSongs[title];
    }

    // Try case-insensitive match
    const songTitle = title.toLowerCase().trim();
    const normalizedSongs = Object.entries(currentPlaylistSongs).map(([key, value]) => [
      key.toLowerCase(),
      value
    ]);

    // Check for exact lowercase match
    const exactMatch = normalizedSongs.find(([key]) => key === songTitle);
    if (exactMatch) {
      return exactMatch[1];
    }

    // Check for partial matches based on playlist
    if (playList.playlistName === 'Saiyaara') {
      if (songTitle.includes('barbaad') && 
          (songTitle.includes('reprise') || songTitle.includes('female'))) {
        return barbaadRepriseImage;
      }
      if (songTitle.includes('barbaad')) return barbaadImage;
      if (songTitle.includes('tum ho')) return tumHoTohImage;
      if (songTitle.includes('humsafar')) return humsafarImage;
      if (songTitle.includes('dhun')) return dhunImage;
      if (songTitle.includes('saiyaara')) return saiyaaraImage;
    } 
    else if (playList.playlistName === 'Maalik') {
      if (songTitle.includes('affair')) return affairImage;
      if (songTitle.includes('dil thaam')) return dilThaamKeImage;
      if (songTitle.includes('naamumkin')) return naamumkinImage;
      if (songTitle.includes('raaj karega')) return raajKaregaImage;
      if (songTitle.includes('maalik')) return maalikImage;
    }

    console.log('No match found for:', title);
    return musicbg;
  };

  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("access_token"),
  };

  const deletePlaylist = async () => {
    try {
      setLoading(true);
      const { status } = await axios.delete(
        `${__URL__}/api/v1/playlist/delete/${id}`,
        { headers }
      );
      if (status === 200) {
        alert("Playlist deleted successfully");
        navigate("/playlists");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed to delete playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist();
    }
  };

  const getPlaylist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${__URL__}/api/v1/playlist/${id}`,
        { headers }
      );
      setPlayList(data["playlist"]);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      alert("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaylist();
  }, [fetchPlaylist, id, __URL__]);

  // Updated to handle both playlists
  const getPlaylistCoverImage = (playlistName) => {
    switch(playlistName) {
      case 'Saiyaara':
        return saiyaaraImage;
      case 'Maalik':
        return maalikImage;
      default:
        return musicbg;
    }
  };

  if (loading || !playList) {
    return <div className="text-white text-center py-4 animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-slate-800 text-white p-5 min-h-screen space-y-5 flex flex-col lg:items-center">
      <div className="lg:mt-10 flex justify-between items-center px-1 lg:w-[70vw]">
        <div className="flex items-center gap-4">
          <img 
            src={getPlaylistCoverImage(playList.playlistName)} 
            alt={`${playList.playlistName} playlist cover`}
            className="w-16 h-16 object-cover rounded-md shadow-lg hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = musicbg;
            }}
          />
          <div>
            <h2 className="text-xl lg:text-4xl font-semibold">{playList.playlistName}</h2>
            <p className="text-md lg:text-lg text-gray-300">Songs - {playList.songs.length}</p>
          </div>
        </div>
        <button 
          onClick={handleDelete}
          className="hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-700"
          title="Delete playlist"
        >
          <MdDeleteForever size={25} />
        </button>
      </div>

      <div className="space-y-2">
        {playList.songs.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No songs in this playlist
          </div>
        ) : (
          playList.songs.map((song, index) => (
            <PlaylilstSong
              key={`${song.title}-${index}`}
              title={song.title}
              artistName={song.artistName}
              songSrc={song.songSrc}
              playlistId={id}
              coverImage={getSongImage(song.title)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Playlist;