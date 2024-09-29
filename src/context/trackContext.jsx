// src/context/trackContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context for track data
const TrackContext = createContext([]);

// Hook to use the TrackContext
export const useTrackContext = () => useContext(TrackContext);

// CORS Proxy and API URL
const CORS_PROXY = process.env.REACT_APP_CORS_PROXY || "https://thingproxy.freeboard.io/fetch/";
const URL_API = process.env.REACT_APP_API_URL;

export const TrackContextProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState({
    song: {},
    autoplay: false,
  });
  const [songReady, setSongReady] = useState(false);
  const [indexTracklist, setIndexTracklist] = useState(0); // Ensure indexTracklist is initialized to 0
  const [tracklist, setTracklist] = useState([]); // Added setTracklist to context
  const [statusSong, setStatusSong] = useState(1); // 1: default song, 2: selected song, 3: artist songs
  const [showMessageError, setShowMessageError] = useState(false); // Track error messages

  // Fetch the default song on initial load
  useEffect(() => {
    fetch(`${URL_CORS}${URL_API}track/603330352`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((song) => {
        setShowMessageError(false);
        setCurrentSong({ song, autoplay: false });
        setStatusSong(1);
      })
      .catch((err) => {
        console.error("Error fetching default song:", err);
        setShowMessageError(true);
      });
  }, []);

  // Function to skip to the next or previous song by song ID
  const skipSong = async (idSong) => {
    try {
      const response = await fetch(`${URL_CORS}${URL_API}track/${idSong}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching song: ${response.status} ${response.statusText}`,
        );
      }
      const song = await response.json();
      setCurrentSong({ song, autoplay: true });
      setStatusSong(3); // Status for skipped song
    } catch (error) {
      console.error("Error skipping song:", error);
      setShowMessageError(true);
    }
  };

  // Function to select a song based on the song ID
  const selectSong = async (idSong) => {
    let urlTracklist = null;
    setSongReady(false);

    try {
      // Fetch the selected song details
      const songResponse = await fetch(`${URL_CORS}${URL_API}track/${idSong}`);

      if (!songResponse.ok) {
        throw new Error(
          `Error fetching song: ${songResponse.status} ${songResponse.statusText}`,
        );
      }

      const song = await songResponse.json();
      setCurrentSong({ song, autoplay: true });
      setStatusSong(2);
      urlTracklist = song.artist.tracklist;

      // Fetch the artist's tracklist
      const tracklistResponse = await fetch(`${URL_CORS}${urlTracklist}`);

      if (!tracklistResponse.ok) {
        throw new Error(
          `Error fetching tracklist: ${tracklistResponse.status} ${tracklistResponse.statusText}`,
        );
      }

      const tracklist = await tracklistResponse.json();
      setTracklist(tracklist.data); // Set the tracklist here
      setSongReady(true);
    } catch (error) {
      console.error("Error fetching or parsing song:", error);
      setShowMessageError(true);
    }
  };

  const prevIndexTracklist = () => {
    if (indexTracklist > 0) {
      setIndexTracklist((prev) => prev - 1);
    }
  };

  const nextIndexTracklist = () => {
    if (indexTracklist < tracklist.length - 1) {
      setIndexTracklist((prev) => prev + 1);
    }
  };

  return (
    <TrackContext.Provider
      value={{
        currentSong,
        selectSong,
        skipSong,
        tracklist,
        setTracklist, // Added setTracklist to context
        indexTracklist, // Ensure indexTracklist is provided here
        prevIndexTracklist,
        nextIndexTracklist,
        songReady,
        statusSong,
        showMessageError,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export default TrackContextProvider;
