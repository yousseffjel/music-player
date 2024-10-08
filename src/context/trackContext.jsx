// src/context/trackContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";

const TrackContext = createContext([]);

export const useTrackContext = () => useContext(TrackContext);

export const TrackContextProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState({ song: {}, autoplay: false });
  const [songReady, setSongReady] = useState(false);
  const [indexTracklist, setIndexTracklist] = useState(0);
  const [tracklist, setTracklist] = useState([]);
  const [statusSong, setStatusSong] = useState(1);
  const [showMessageError, setShowMessageError] = useState(false);

  // Default song request updated to use the /api proxy path
  useEffect(() => {
    fetch(`/api/track/3135556`)
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

  // Skipping song request updated to use the /api proxy path
  const skipSong = async (idSong) => {
    try {
      const response = await fetch(`/api/track/${idSong}`);
      if (!response.ok) {
        throw new Error(`Error fetching song: ${response.status} ${response.statusText}`);
      }
      const song = await response.json();
      setCurrentSong({ song, autoplay: true });
      setStatusSong(3);
    } catch (error) {
      console.error("Error skipping song:", error);
      setShowMessageError(true);
    }
  };

  // Selecting song and fetching artist's tracklist updated to use the /api proxy path
  const selectSong = async (idSong) => {
    setSongReady(false);

    try {
      const songResponse = await fetch(`/api/track/${idSong}`);

      if (!songResponse.ok) {
        throw new Error(`Error fetching song: ${songResponse.status} ${songResponse.statusText}`);
      }

      const song = await songResponse.json();
      setCurrentSong({ song, autoplay: true });
      setStatusSong(2);

      // Fetch the artist's tracklist, assuming the tracklist path is correct
      const tracklistResponse = await fetch(song.artist.tracklist.replace('https://api.deezer.com', '/api'));

      if (!tracklistResponse.ok) {
        throw new Error(`Error fetching tracklist: ${tracklistResponse.status} ${tracklistResponse.statusText}`);
      }

      const tracklist = await tracklistResponse.json();
      setTracklist(tracklist.data);
      setSongReady(true);
    } catch (error) {
      console.error("Error fetching or parsing song:", error);
      setShowMessageError(true);
    }
  };

  const prevIndexTracklist = () => {
    setIndexTracklist((prev) => Math.max(0, prev - 1));
  };

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
