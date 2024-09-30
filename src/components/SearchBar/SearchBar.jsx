import React, { useRef, useState } from "react";
import { Kbd } from "@chakra-ui/react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTrackContext } from "../../context/trackContext";
import { Icon } from "../Stateless/Icon";
import { LoadingResults } from "../Stateless/Loading/LoadingResults";
import TrackCard from "../TrackCard/TrackCard";

const SearchBar = () => {
  const { setTracklist } = useTrackContext();

  const [results, setResults] = useState({ data: [] });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const inputRef = useRef();

  // Search tracks function to handle search input and fetch results
  const searchTracks = (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    setLoadingSearch(true);

    const URL_SEARCH = `/api/search?q=${inputRef.current.value}&limit=5&index=0`;

    fetch(URL_SEARCH)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  // Parse the response as JSON
      })
      .then((parsedData) => {
        setLoadingSearch(false);
        setResults(parsedData);
        setTracklist(parsedData.data);  // Set the tracklist in context
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching tracks:", error);
      });
  };

  return (
    <div className="w-full max-w-2xl px-0 mx-auto lg:max-w-xl">
      <div className="px-4 py-6 space-y-5 lg:space-y-3 lg:py-0">
        <form onSubmit={searchTracks} className="relative overflow-visible">
          <button
            type="button"
            onClick={searchTracks}
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-400 sm:text-sm"
          >
            <Icon icon={faSearch} className="text-base" />
          </button>
          <input
            type="text"
            ref={inputRef}
            placeholder="Search"
            className="block w-full py-2 pl-10 border rounded-lg placeholder:text-stone-400 focus:placeholder:text-pink-400 border-stone-500 focus:border-pink-400 focus:shadow focus:shadow-pink-400/50 bg-stone-900 pr-11 focus:outline-none"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-lg text-stone-800">
            <Kbd>
              Enter<span className="ml-0.5">↵</span>
            </Kbd>
          </span>
        </form>
        <div className="w-full px-4 py-4 rounded-lg bg-stone-800">
          {loadingSearch ? (
            <LoadingResults />
          ) : results.data.length === 0 ? (
            <div className="w-full text-center text-stone-600">
              Make a search to display results
            </div>
          ) : (
            <>
              <ul className="w-full space-y-2">
                {results.data.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
