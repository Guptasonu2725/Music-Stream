import React, { useState, useContext } from "react";
import axios from "axios";  
import { SongContext } from "../Context/SongContext";
import playlist from "../assets/playlist.jpg";
import saiyaaraImage from "../assets/saiyaara-playlist.jpeg";
import maalikImage from "../assets/Maalik.webp"; // Add this import
import { CgPlayListAdd } from "react-icons/cg";
import { Link } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";

const PlaylistCard = ({ playlistName, playlistId, noSongs }) => {
    const { setFetchPlaylist } = useContext(FetchContext);
    const { __URL__ } = useContext(SongContext);
    const { list, dispatchList } = useContext(QueueContext);
    const [loading, setLoading] = useState(false);

    // Get correct playlist image
    const getPlaylistImage = () => {
        const name = playlistName.toLowerCase();
        if (name === 'saiyaara') return saiyaaraImage;
        if (name === 'maalik') return maalikImage;
        return playlist;
    };

    // Adding song to playlist
    const addSongToPlaylist = async () => {
        try {
            if (list.length === 0) {
                return alert("Please select a song");
            }

            setLoading(true);
            const headers = {
                "Content-Type": "application/json",
                "X-Auth-Token": localStorage.getItem("access_token"),
            };

            const { status } = await axios.post(
                `${__URL__}/api/v1/playlist/add/${playlistId}`,
                list,
                { headers }
            );

            if (status === 200) {
                alert("Song added to playlist");
                setFetchPlaylist(prev => !prev);
                dispatchList({ type: "REMOVE_SONG", payload: list[0].title });
            }
        } catch (error) {
            console.error("Error adding song to playlist:", error);
            alert("Failed to add song to playlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex border-b-2 pb-4 items-center justify-between hover:bg-gray-50 p-3 transition-colors">
            <Link 
                to={`/playlist/${playlistId}`} 
                className="flex space-x-5 flex-1"
            >
                <img 
                    src={getPlaylistImage()} 
                    alt={`${playlistName} playlist cover`} 
                    className="w-20 h-20 object-cover rounded-md shadow-md hover:scale-105 transition-transform duration-300" 
                />
                <div className="flex flex-col justify-center">
                    <p className="font-semibold text-lg">{playlistName}</p>
                    <p className="text-gray-600">Songs - {noSongs}</p>
                </div>
            </Link>
            <button 
                onClick={addSongToPlaylist}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50"
                title="Add song to playlist"
            >
                <CgPlayListAdd 
                    size={35} 
                    className={`${loading ? 'opacity-50' : 'hover:scale-110'}`}
                />
            </button>
        </div>
    );
};

export default PlaylistCard;