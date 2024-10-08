### Project Overview

This is a music player web application built using React. The app allows users to search for tracks using the Deezer API, play 30-second previews of tracks, and view related information such as the album and artist details. It also supports basic controls like play/pause, skip to the next/previous track, and volume adjustment. The app uses `Context API` to manage the state of the tracklist and current song across components.

### Key Technologies
- **React**: Frontend framework for building user interfaces.
- **Chakra UI**: Provides design primitives and a themeable system.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Deezer API**: Used for fetching track data.
- **React Context API**: Manages global state across the app.

### Project Structure

```plaintext
public/
    ├── index.html              # The main HTML file.
src/
    ├── components/             # Reusable components in the application.
    │   ├── MusicPlayer/        # Music player component and controls.
    │   ├── SearchBar/          # Search bar to find tracks via the API.
    │   ├── Stateless/          # Stateless components such as icons and loaders.
    │   ├── TrackCard/          # Component to display individual track information.
    ├── context/                # Context for managing track-related state.
    ├── utils/                  # Utility files.
    ├── App.css                 # Global styles for the app.
    ├── App.jsx                 # The main App component.
    ├── index.css               # Tailwind CSS base and utilities.
    ├── index.js                # Entry point for React app.
.env.production                  # Environment variables for production.
netlify.toml                     # Netlify configuration for deployment.
tailwind.config.js               # Tailwind configuration.
yarn.lock                        # Yarn lock file.
```

---

## Documentation for Each Component

### `MusicPlayer.jsx`

#### Description:
This component manages audio playback and user interaction with the music player, including play/pause, skipping tracks, and volume control. It uses `refs` to control the audio element and handle the progress bar.

#### Key Features:
- **Play/Pause functionality** using the HTML audio element.
- **Skip track functionality** using the `trackContext`.
- **Volume control** using a range slider.
- **Display track information** like album cover, title, and artist.

#### Important Functions:
- `togglePlayPause`: Toggles between playing and pausing the audio.
- `whilePlaying`: Updates the progress bar as the song plays.
- `changeRange`: Updates the song’s current time based on the progress bar.
- `changeVolume`: Adjusts the volume.
- `prevTracklist` & `nextTracklist`: Skips to the previous or next track.

#### Dependencies:
- FontAwesome icons for player controls.
- `useTrackContext` from the context to manage the current song and tracklist.

```jsx
import { useTrackContext } from "../../context/trackContext";
import { Icon } from "../Stateless/Icon";
...
const MusicPlayer = () => {
    // Audio playback state
    const { currentSong, ... } = useTrackContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef();

    // Handle play/pause
    const togglePlayPause = () => {
        ...
    };

    return (
        <div>
            {/* Display song details and controls */}
            <div>
                <audio ref={audioRef} ... />
                <button onClick={togglePlayPause}>
                    {!isPlaying ? <Icon icon={faPlay} /> : <Icon icon={faPause} />}
                </button>
                {/* Track progress */}
                <input ref={progressBarRef} type="range" ... />
            </div>
        </div>
    );
};
```

### `SearchBar.jsx`

#### Description:
The search bar allows users to search for tracks via the Deezer API. It updates the `trackContext` with the results and supports pagination.

#### Key Features:
- **Track search functionality**: Sends a query to Deezer's search API.
- **Pagination**: Allows users to navigate between pages of results.
- **Handles search loading states**.

#### Important Functions:
- `searchTracks`: Fetches search results from the Deezer API and updates the `trackContext`.
- `nextPage` & `prevPage`: Handles pagination by adjusting the query index.

#### Example:

```jsx
const SearchBar = () => {
    const { setTracklist } = useTrackContext();
    const [results, setResults] = useState({ data: [] });
    const inputRef = useRef();

    const searchTracks = (e) => {
        e.preventDefault();
        const URL_SEARCH = `/api/search?q=${inputRef.current.value}&limit=5&index=${index}`;
        fetch(URL_SEARCH)
            .then((response) => response.json())
            .then((parsedData) => {
                setResults(parsedData);
                setTracklist(parsedData.data);
            });
    };

    return (
        <form onSubmit={searchTracks}>
            <input ref={inputRef} placeholder="Search" />
            <button type="submit">Search</button>
        </form>
    );
};
```

### `TrackCard.jsx`

#### Description:
Displays individual track information, including album cover, title, artist, and duration. Clicking on a track plays the preview via the `trackContext`.

#### Features:
- **Select song functionality**: Clicking the play button triggers the track to play using `selectSong`.
- **Loading state**: Displays a loading spinner when the track is loading.

#### Example:

```jsx
const TrackCard = ({ track }) => {
    const { selectSong, songReady } = useTrackContext();

    const clickSong = (id) => {
        selectSong(id);
    };

    return (
        <li>
            <img src={track.album.cover_medium} alt={track.album.title} />
            <button onClick={() => clickSong(track.id)}>
                <Icon icon={faPlay} />
            </button>
            <p>{track.title}</p>
            <p>{track.artist.name}</p>
        </li>
    );
};
```

### `LoadingResults.jsx` and `LoadingSearch.jsx`

These are stateless components that show loading spinners when results are being fetched.

```jsx
export const LoadingResults = () => (
    <div className="flex justify-center">
        <svg className="animate-spin" ... ></svg>
    </div>
);
```

---

## Context (`trackContext.jsx`)

### Purpose:
Manages global state related to tracks, the current song, and controls for skipping and selecting songs. This context provides the main state management for the app.

### Key State Variables:
- `currentSong`: The song currently being played.
- `tracklist`: The list of tracks fetched from the Deezer API.
- `statusSong`: The status of the currently selected song (default, selected, or artist's songs).
- `indexTracklist`: Keeps track of the current song's index in the tracklist.

### Important Functions:
- `selectSong`: Fetches a song and the artist's tracklist based on the selected song.
- `skipSong`: Skips to the next or previous song in the tracklist.

```jsx
const TrackContext = createContext([]);

export const TrackContextProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(...);
    
    const skipSong = async (id) => {
        const response = await fetch(`/api/track/${id}`);
        const song = await response.json();
        setCurrentSong(song);
    };

    return (
        <TrackContext.Provider value={{ currentSong, skipSong }}>
            {children}
        </TrackContext.Provider>
    );
};
```

---

## `App.jsx`

This is the root component of the app, wrapping everything in `TrackContextProvider` and rendering the `MusicPlayer` and `SearchBar` components.

```jsx
import TrackContextProvider from "./context/trackContext";

const App = () => (
    <TrackContextProvider>
        <div className="app-container">
            <MusicPlayer />
            <SearchBar />
        </div>
    </TrackContextProvider>
);

export default App;
```

---

## Deployment (`netlify.toml`)

This file contains the Netlify configuration to deploy the app. It defines the build command and API redirects for the Deezer API.

```toml
[build]
  command = "yarn build"
  publish = "build"

[[redirects]]
  from = "/api/*"
  to = "https://api.deezer.com/:splat"
  status = 200
  force = true
```

---

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

