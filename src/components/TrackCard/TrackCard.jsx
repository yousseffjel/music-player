// TrackCard component displays a track's details including album cover, title, artist, and duration
import React, { useEffect, useState } from "react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useTrackContext } from "../../context/trackContext";
import { Icon } from "../Stateless/Icon";
import { LoadingSearch } from "../Stateless/Loading/LoadingSearch";

const TrackCard = ({ track }) => {
  const { selectSong, songReady } = useTrackContext();  // Use trackContext to select a song
  const [isLoadingSelectSong, setIsLoadingSelectSong] = useState(false);

  // Handles selecting a track when clicked
  const clickSong = async (id) => {
    selectSong(id);  // Set the selected song in context
    setIsLoadingSelectSong(true);  // Show loading indicator
  };

  // Reset loading state when the song is ready to play
  useEffect(() => {
    if (songReady) {
      setIsLoadingSelectSong(false);
    }
  }, [songReady]);

  // Helper function to format time with leading zero
  const leadingZero = (time) => {
    return time < 10 ? "0" + time : time;
  };

  return (
    <li className="track-card-container">
      {/* Display track album cover and play button */}
      <button onClick={() => clickSong(track.id)} className="track-card-play-btn">
        <img src={track.album.cover_medium} alt="Album cover" />
        <div className="track-card-play-overlay">
          {isLoadingSelectSong && !songReady ? (
            <LoadingSearch />  // Show loading spinner while song is being loaded
          ) : (
            <Icon icon={faPlay} className="play-icon" />  // Play icon when track is ready
          )}
        </div>
      </button>

      {/* Track details (title, artist, album) */}
      <div className="track-details">
        <p className="album-title">{track.album.title}</p>
        <p className="track-title">{track.title}</p>
        <p className="artist-name">{track.artist.name}</p>
      </div>

      {/* Track duration */}
      <div className="track-duration">
        <Icon icon={faClock} className="clock-icon" />
        <p>{`${leadingZero(Math.floor(track.duration / 60))}:${leadingZero(track.duration % 60)}`}</p>
      </div>
    </li>
  );
};

export default TrackCard;
