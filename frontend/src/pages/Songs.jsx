import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";
import { SidebarContext } from "../Context/SibebarContext";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import { QueueContext } from "../Context/QueueContex";

// Import all images
import musicbg from "../assets/musicbg.jpg";
import saiyaaraImage from "../assets/Saiyaara-playlist.jpeg";
import tumHoTohImage from "../assets/Tum ho Toh.webp";
import humsafarImage from "../assets/Humsafar.jpg";
import dhunImage from "../assets/Dhun.jpg";
import barbaadImage from "../assets/Barbaad.jpg";
import barbaadRepriseImage from "../assets/Barbaad-reprise.jpg";
import maalikImage from "../assets/Maalik.webp";
import affairImage from "../assets/Affair.jpg";
import dilThaamKeImage from "../assets/Dil-Thaam-Ke.jpg";
import naamumkinImage from "../assets/Naamumkin.jpg";
import raajKaregaImage from "../assets/Raaj Karega Maalik.jpg";

// Updated song mappings with exact titles from your app
const SONG_IMAGES = {
  'Saiyaara': saiyaaraImage,
  'Saiyaara Reprise Female': saiyaaraImage,
  'Barbaad': barbaadImage,
  'Barbaad Reprise Female': barbaadRepriseImage,
  'Tum Ho Toh': tumHoTohImage,
  'Humsafar': humsafarImage,
  'Dhun': dhunImage,
  'Affair': affairImage,
  'Dil Thaam Ke': dilThaamKeImage,
  'Naamumkin': naamumkinImage,
  'Raaj Karega Maalik': raajKaregaImage,
  'Maalik': maalikImage
};

const Songs = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const { fetchSong } = useContext(FetchContext);
  const { __URL__ } = useContext(SongContext);
  
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState(null);

  const getSongImage = (title) => {
    // Try exact match first
    if (SONG_IMAGES[title]) {
      return SONG_IMAGES[title];
    }

    // Try case-insensitive match
    const songTitle = title.toLowerCase().trim();
    const normalizedSongs = Object.entries(SONG_IMAGES).reduce((acc, [key, value]) => {
      acc[key.toLowerCase()] = value;
      return acc;
    }, {});

    if (normalizedSongs[songTitle]) {
      return normalizedSongs[songTitle];
    }

    // Try partial matches
    if (songTitle.includes('barbaad reprise') || songTitle.includes('barbaad female')) {
      return barbaadRepriseImage;
    }
    if (songTitle.includes('tum ho')) return tumHoTohImage;
    if (songTitle.includes('humsafar')) return humsafarImage;
    if (songTitle.includes('dhun')) return dhunImage;
    if (songTitle.includes('affair')) return affairImage;
    if (songTitle.includes('dil thaam')) return dilThaamKeImage;
    if (songTitle.includes('naamumkin')) return naamumkinImage;
    if (songTitle.includes('raaj karega')) return raajKaregaImage;
    if (songTitle.includes('maalik')) return maalikImage;
    if (songTitle.includes('saiyaara')) return saiyaaraImage;

    console.log(`No image match found for: ${title}`);
    return musicbg;
  };

  useEffect(() => {
    if (showMenu) setShowMenu(false);
    
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${__URL__}/api/v1/songs`);
        setSongs(data["songs"]);
      } catch (error) {
        console.error("Error fetching songs:", error);
        alert("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [fetchSong, showMenu, setShowMenu, __URL__]);

  const closeMenu = () => setShowMenu(false);

  return (
    <div onClick={closeMenu} className="bg-gray-900 p-5 space-y-2 min-h-screen">
      {loading ? (
        <div className="text-white text-center py-4 animate-pulse">
          Loading songs...
        </div>
      ) : songs && songs.length > 0 ? (
        songs.map((song) => (
          <SongCard
            key={song._id}
            title={song.title}
            artistName={song.artist}
            songSrc={song.song}
            userId={song.uploadedBy}
            songId={song._id}
            file={song.file}
            coverImage={getSongImage(song.title)}
          />
        ))
      ) : (
        <div className="text-white text-center py-4">
          No songs available
        </div>
      )}
    </div>
  );
};

export default Songs;