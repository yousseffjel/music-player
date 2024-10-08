// MusicPlayer component handles the audio controls and rendering of the current song details
import React, { useState, useRef } from "react";
import { useTrackContext } from "../../context/trackContext";
import {
  faPause,
  faPlay,
  faStepBackward,
  faStepForward,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Stateless/Icon";

const MusicPlayer = () => {
  // Context: Get current song, tracklist, and control methods from trackContext
  const {
    currentSong,
    tracklist,
    indexTracklist,
    prevIndexTracklist,
    nextIndexTracklist,
    skipSong,
    // statusSong, 
  } = useTrackContext();

  // Local state for controlling play/pause, duration, and current time
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // References for audio element, volume slider, and progress bar
  const audioRef = useRef();
  const volumeRef = useRef();
  const progressBarRef = useRef();
  const animationRef = useRef();

  // Handles the metadata loading event of the audio element
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      const seconds = Math.round(audioRef.current.duration);
      setDuration(seconds);  // Set the song duration
      progressBarRef.current.max = audioRef.current.duration;

      // Auto-play the song if autoplay is enabled
      if (currentSong?.autoplay) {
        audioRef.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
        setIsPlaying(true);
      }
    }
  };

  // Toggle play and pause functionality
  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);  // Toggle play/pause state

    if (!prevValue && audioRef.current) {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);  // Start playing
    } else if (audioRef.current) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);  // Pause the playback
    }
  };

  // Updates the progress bar while the song is playing
  const whilePlaying = () => {
    if (audioRef.current) {
      progressBarRef.current.value = audioRef.current.currentTime;  // Update progress bar
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);  // Keep updating

      // When the audio ends, stop the playing state
      if (audioRef.current.ended) {
        setIsPlaying(false);
        return;
      }
    }
  };

  // Handle changes in the progress bar to update song's current time
  const changeRange = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = progressBarRef.current.value;
      changePlayerCurrentTime();
    }
  };

  // Change volume by modifying the audio element's volume property
  const changeVolume = () => {
    if (audioRef.current) {
      audioRef.current.volume = volumeRef.current.value;
      volumeRef.current.style.setProperty(
        "--seek-before-width",
        `${volumeRef.current.value * 100}%`
      );
    }
  };

  // Calculate and update the current time display
  const changePlayerCurrentTime = () => {
    setCurrentTime(Math.round(progressBarRef.current.value));
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${(progressBarRef.current.value / progressBarRef.current.max) * 100}%`
    );
  };

  // Leading zero helper function for time formatting
  const leadingZero = (time) => {
    return time < 10 ? "0" + time : time;
  };

  // Skip to the previous track in the tracklist
  const prevTracklist = () => {
    if (indexTracklist > 0) {
      prevIndexTracklist();  // Update index in context
      skipSong(tracklist[indexTracklist - 1]?.id);  // Skip to previous song
    }
  };

  // Skip to the next track in the tracklist
  const nextTracklist = () => {
    if (indexTracklist < tracklist.length - 1) {
      nextIndexTracklist();  // Update index in context
      skipSong(tracklist[indexTracklist + 1]?.id);  // Skip to next song
    }
  };

  return (
    <div className="music-player-container">
      {/* Song info */}
      <div className="song-details">
        <div className="album-cover">
          {currentSong?.song?.album?.cover_medium && (
            <img src={currentSong.song.album.cover_medium} alt="Album Cover" />
          )}
        </div>
        <div className="song-info">
          <h2>{currentSong?.song?.title}</h2>
          <p>{currentSong?.song?.album?.title}</p>
          <p>
            {currentSong?.song?.contributors?.map((artist, index) => (
              <span key={index}>
                {artist.name}
                {index !== currentSong.song.contributors.length - 1 && ", "}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Audio controls */}
      <div className="audio-controls">
        <button onClick={prevTracklist} disabled={indexTracklist === 0}>
          <Icon icon={faStepBackward} />
        </button>
        <button onClick={togglePlayPause}>
          <Icon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button onClick={nextTracklist} disabled={indexTracklist === tracklist.length - 1}>
          <Icon icon={faStepForward} />
        </button>
      </div>

      {/* Volume control */}
      <div className="volume-control">
        <Icon icon={faVolumeMute} />
        <input ref={volumeRef} type="range" onChange={changeVolume} />
        <Icon icon={faVolumeUp} />
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <audio ref={audioRef} src={currentSong?.song?.preview} onLoadedMetadata={onLoadedMetadata} />
        <input ref={progressBarRef} type="range" onChange={changeRange} />
        <div>{`${leadingZero(Math.floor(currentTime / 60))}:${leadingZero(currentTime % 60)}`}</div>
        <div>{`${leadingZero(Math.floor(duration / 60))}:${leadingZero(duration % 60)}`}</div>
      </div>
    </div>
  );
};

export default MusicPlayer;
