import React, { useRef, useState, useEffect, useContext } from "react";
import stereo from "./assets/stereo.jpg";
import { SongContext } from "./Context/SongContext";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi";
import { HiPause } from "react-icons/hi";

const MusicPlayer = () => {
  //References
  const audioRef = useRef();
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation
  const sourceRef = useRef();

  //Context
  const { song } = useContext(SongContext);
  // sourceRef.current.src = 'http://localhost:1337/1224.mp3';
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    console.log(prevValue)
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  useEffect(() => {
    const seconds = Math.floor(audioRef.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioRef?.current?.loadedmetadata, audioRef?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const whilePlaying = () => {
    progressBar.current.value = audioRef.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioRef.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  // Next and Previous Song
  const nextSong = () => {
    //pausing the ongoing song
    audioRef.current.pause();

    //finding the index of the current song
    const index = songs.findIndex((song) => {
      return (
        song.split("/")[3] === sourceRef.current.src.toString().split("/")[5]
      );
    });

    //if the current song is the last song in the array
    if (index === songs.length - 1) {
      sourceRef.current.src = songs[0];
    } else {
      sourceRef.current.src = songs[index + 1];
    }

    //playing the next song
    setIsPlaying(true);
    audioRef.current.load();
    audioRef.current.play();
  };

  const previousSong = () => {
    //pausing the ongoing song
    audioRef.current.pause();

    const index = songs.findIndex((song) => {
      return (
        song.split("/")[3] === sourceRef.current.src.toString().split("/")[5]
      );
    });

    //if the current song is the last song in the array
    if (index === 0) {
      sourceRef.current.src = songs[songs.length - 1];
    } else {
      sourceRef.current.src = songs[index - 1];
    }

    //playing the next song
    setIsPlaying(true);
    audioRef.current.load();
    audioRef.current.play();
  };

  return (
    <div className="fixed bg-gray-200 bottom-0 left-0 px-4 py-2 flex justify-start items-center space-x-4 w-80 rounded-tr-lg shadow-lg z-50 border border-gray-400">
      <div className="flex space-x-3 items-center">
        {/* Image */}
        <img src={stereo} alt="" className="rounded-lg w-10" />
        {/* Song Name and Artist Name */}
        <div className="flex flex-col justify-center items-start">
          <h3 className="text-sm font-semibold">Song Name</h3>
          <p className="text-xs text-gray-700">Artist Name</p>
        </div>
      </div>

      {/* Audio tag */}
      <audio ref={audioRef} preload="auto">
        <source
          ref={sourceRef}
          src={`https://music-player-app-backend-yq0c.onrender.com/api/v1/stream/4979f9de26aadec57449c4690ab0ad60`}
          type="audio/mpeg"
        />
      </audio>

      {/* Audio controls */}
      <div className="flex space-x-2 items-center ml-auto">
        {/* backward */}
        <button onClick={previousSong}>
          <BiSkipPreviousCircle size={30} />
        </button>

        {/* Play / Pause */}
        <button onClick={togglePlayPause}>
          {isPlaying ? (
            <HiPause size={36} />
          ) : (
            <BsFillPlayCircleFill size={36} />
          )}
        </button>

        {/* forward */}
        <button onClick={nextSong}>
          <BiSkipNextCircle size={30} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
