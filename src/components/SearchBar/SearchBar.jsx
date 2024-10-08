import React, { useRef, useState } from "react";
import { useTrackContext } from "../../context/trackContext";
import { LoadingResults } from "../Stateless/Loading/LoadingResults";
import TrackCard from "../TrackCard/TrackCard";

const SearchBar = () => {
  const { setTracklist } = useTrackContext();

  const [results, setResults] = useState({ data: [] });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // For pagination
  const [index, setIndex] = useState(0);  // For API query offset
  const inputRef = useRef();

  // Search tracks function to handle search input and fetch results
  const searchTracks = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoadingSearch(true);

    const URL_SEARCH = `/api/search?q=${inputRef.current.value}&limit=5&index=${index}`;

    fetch(URL_SEARCH)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
      })
      .then((parsedData) => {
        setLoadingSearch(false);
        setResults(parsedData);
        setTracklist(parsedData.data); // Set the tracklist in context
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching tracks:", error);
      });
  };

  // Go to the next page of results
  const nextPage = () => {
    setCurrentPage(currentPage + 1); // Increment the page
    setIndex(index + 5); // Increase index by 5 (or whatever the limit is)
    searchTracks({ preventDefault: () => {} }); // Trigger search with updated index
  };

  // Go to the previous page of results
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Decrease the page
      setIndex(index - 5); // Decrease index by 5
      searchTracks({ preventDefault: () => {} }); // Trigger search with updated index
    }
  };

  return (
    <div className="w-full max-w-2xl px-0 mx-auto lg:max-w-xl">
      <div className="px-4 py-6 space-y-5 lg:space-y-3 lg:py-0">
        <form onSubmit={searchTracks} className="relative overflow-visible flex">
          <input
            type="text"
            ref={inputRef}
            placeholder="Search"
            className="block w-full py-2 pl-3 border rounded-lg placeholder:text-stone-400 focus:placeholder:text-blue-400 border-stone-500 focus:border-blue-400 focus:shadow focus:shadow-blue-400/50 bg-stone-900 pr-11 focus:outline-none"
          />
          <button
            type="submit" // Submit type to trigger form submission
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400 ml-2"
          >
            Search
          </button>
        </form>

        {/* Results Section */}
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
              {/* Pagination Section */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-white bg-stone-700 rounded hover:bg-stone-600 disabled:bg-stone-800"
                >
                  Previous
                </button>
                {/* Display current page number */}
                <span className="text-white">Page {currentPage}</span>
                <button
                  onClick={nextPage}
                  disabled={results.data.length < 5}
                  className="px-4 py-2 text-white bg-stone-700 rounded hover:bg-stone-600"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
