// App component is the root of the application.
// It wraps the entire app in the TrackContextProvider to provide global state management for tracks.

import React from "react";
import TrackContextProvider from "./context/trackContext";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import SearchBar from "./components/SearchBar/SearchBar";
import "./App.css";

const App = () => {
  return (
    // Wrapping the app in TrackContextProvider to give all child components access to track state
    <TrackContextProvider>
      <div className="min-h-screen py-10 text-white bg-stone-900 font-inter">
        <div className="flex flex-col items-center h-full mx-auto space-y-9 max-w-7xl">
          
          {/* App header with title */}
          <div className="flex flex-col items-center">
            <p className="py-1 text-5xl font-bold text-transparent cursor-default sm:text-6xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text">
              Music Player
            </p>
          </div>

          {/* Music player and search bar sections */}
          <div className="w-full lg:flex lg:justify-center lg:space-x-4">
            <div className="flex flex-col items-center space-y-5">
              {/* Music player component */}
              <MusicPlayer />
              
              {/* Additional information under the player */}
              <div className="flex flex-col items-center space-y-1">
                <p className="text-lg">You can only listen to 30 seconds of the song.</p>
                <p className="text-lg">Those are the API conditions :)</p>
              </div>
            </div>
            
            {/* Search bar component */}
            <SearchBar />
          </div>
        </div>

        {/* Footer with developer attribution */}
        <footer className="w-full text-center py-4 mt-8">
          Developed by{" "}
          <a
            href="https://yousseffjel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
          >
            Youssef Fjel
          </a>
        </footer>
      </div>
    </TrackContextProvider>
  );
};

export default App;
