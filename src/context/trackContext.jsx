// TrackContext manages the state for the current song, tracklist, and playback functionality
import React, { createContext, useContext, useEffect, useState } from "react";

// Create a new context for track state
const TrackContext = createContext([]);

// Custom hook to use trackContext
export const useTrackContext = () => useContext(TrackContext);

// TrackContextProvider component provides the context to all child components
export const TrackContextProvider = ({ children }) => {
  // State variables for current song, tracklist, song status, etc.
  const [currentSong, setCurrentSong] = useState({ song: {}, autoplay: false });
  const [songReady, setSongReady] = useState(false);
  const [indexTracklist, setIndexTracklist] = useState(0);
  const [tracklist, setTracklist] = useState([]);
  const [statusSong, setStatusSong] = useState(1);
  const [showMessageError, setShowMessageError] = useState(false);

  // Fetch and set default song on initial load
  useEffect(() => {
    fetch(`/api/track/3135556`)  // Default song from Deezer API
      .then((response) => response.json())
      .then((song) => {
        setCurrentSong({ song, autoplay: false });
        setStatusSong(1);  // Default song status
      })
      .catch((err) => {
        console.error("Error fetching default song:", err);
        setShowMessageError(true);  // Show error message if API fails
      });
  }, []);

  // Skip to a song based on its ID
  const skipSong = async (idSong) => {
    try {
      const response = await fetch(`/api/track/${idSong}`);  // Fetch song from API
      const song = await response.json();
      setCurrentSong({ song, autoplay: true });
      setStatusSong(3);  // Update status to artist's songs
    } catch (error) {
      console.error("Error skipping song:", error);
      setShowMessageError(true);  // Show error if song skip fails
    }
  };

  // Select a song and fetch artist's tracklist
  const selectSong = async (idSong) => {
    setSongReady(false);

    try {
      const songResponse = await fetch(`/api/track/${idSong}`);  // Fetch the song
      const song = await songResponse.json();
      setCurrentSong({ song, autoplay: true });
      setStatusSong(2);  // Set status to selected song

      // Fetch the artist's tracklist
      const tracklistResponse = await fetch(song.artist.tracklist.replace('https://api.deezer.com', '/api'));
      const tracklist = await tracklistResponse.json();
      setTracklist(tracklist.data);  // Update tracklist
      setSongReady(true);  // Mark song as ready to play
    } catch (error) {
      console.error("Error fetching or parsing song:", error);
      setShowMessageError(true);
    }
  };

  // Update index to previous track
  const prevIndexTracklist = () => {
    setIndexTracklist((prev) => Math.max(0, prev - 1));
  };

  // Update index to next track
  const nextIndexTracklist = () => {
    setIndexTracklist((prev) => Math.min(tracklist.length - 1, prev + 1));
  };

  return (
    <TrackContext.Provider value={{
      currentSong,
      selectSong,
      skipSong,
      tracklist,
      setTracklist,
      indexTracklist,
      prevIndexTracklist,
      nextIndexTracklist,
      songReady,
      statusSong,
      showMessageError,
    }}>
      {children}
    </TrackContext.Provider>
  );
};

export default TrackContextProvider;
