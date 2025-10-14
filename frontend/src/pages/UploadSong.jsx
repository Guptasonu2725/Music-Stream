import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SidebarContext } from "../Context/SibebarContext";
import { useNavigate } from "react-router-dom";
import { SongContext } from "../Context/SongContext";
import { MdCloudUpload, MdAudiotrack } from "react-icons/md";
import musicbg from "../assets/musicbg.jpg";

const UploadSong = () => {
  const navigate = useNavigate();
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const { __URL__ } = useContext(SongContext);
  
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, [showMenu, setShowMenu]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus({ message: "", type: "" }); // Clear previous messages

    if (!file) {
      setUploadStatus({ message: "Please select an audio file.", type: "error" });
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("album", album);
      formData.append("description", description);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          "x-auth-token": localStorage.getItem("access_token"),
        },
      };

      await axios.post(
        `${__URL__}/api/v1/song/upload`,
        formData,
        config
      );

      setUploadStatus({ message: "Song uploaded successfully! Redirecting...", type: "success" });
      setTimeout(() => {
        navigate("/explore");
      }, 2000);

    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload song. Please try again.";
      setUploadStatus({ message: errorMessage, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10 text-white px-5 bg-gradient-to-b from-slate-900 to-slate-800">
      <h1 className="text-3xl font-bold text-center lg:text-4xl bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent mb-10">
        Upload Your Song
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col items-center w-full max-w-md space-y-8"
      >
        {/* Song Details Form */}
        <div className="w-full space-y-6">
          <div className="form-group text-center">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-center"
              placeholder="Enter song title"
              required
            />
          </div>

          <div className="form-group text-center">
            <label className="block text-sm font-medium mb-2">Artist</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-center"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div className="form-group text-center">
            <label className="block text-sm font-medium mb-2">Album</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-center"
              placeholder="Enter album name"
              required
            />
          </div>

          <div className="form-group text-center">
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-center"
              placeholder="Enter song description"
              required
            />
          </div>
        </div>

        {/* Audio File Upload */}
        <div className="form-group w-full text-center">
          <label className="block text-sm font-medium mb-2">Audio File</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <MdAudiotrack size={40} className="text-yellow-500 mb-2" />
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">MP3, WAV (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-400">
              Selected file: {file.name}
            </p>
          )}
        </div>

        {/* Upload Status Message */}
        {uploadStatus.message && (
          <div className={`w-full p-3 rounded-lg text-center text-sm font-medium ${
            uploadStatus.type === 'success' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {uploadStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !localStorage.getItem("access_token")}
          className={`w-full py-3 rounded-lg font-medium text-lg transition-colors
            ${uploading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900'
            }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <MdCloudUpload className="animate-bounce mr-2" size={24} />
              Uploading...
            </div>
          ) : (
            'Upload Song'
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadSong;
