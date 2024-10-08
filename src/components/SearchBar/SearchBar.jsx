// SearchBar component allows users to search tracks and update the tracklist in context
import React, { useRef, useState } from "react";
import { useTrackContext } from "../../context/trackContext";
import { LoadingResults } from "../Stateless/Loading/LoadingResults";
import TrackCard from "../TrackCard/TrackCard";

const SearchBar = () => {
  const { setTracklist } = useTrackContext();  // Update tracklist in context
  const [results, setResults] = useState({ data: [] });  // Search results
  const [loadingSearch, setLoadingSearch] = useState(false);  // Loading state
  const [currentPage, setCurrentPage] = useState(1);  // Current page for pagination
  const [index, setIndex] = useState(0);  // API offset for pagination
  const inputRef = useRef();  // Reference to input field

  // Handle search input and make API call to search tracks
  const searchTracks = (e) => {
    e.preventDefault();
    setLoadingSearch(true);

    const URL_SEARCH = `/api/search?q=${inputRef.current.value}&limit=5&index=${index}`;

    // Fetch data from Deezer API
    fetch(URL_SEARCH)
      .then((response) => response.json())
      .then((parsedData) => {
        setLoadingSearch(false);
        setResults(parsedData);
        setTracklist(parsedData.data);  // Update tracklist in context
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching tracks:", error);
      });
  };

  // Go to the next page of search results
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    setIndex(index + 5);
    searchTracks({ preventDefault: () => {} });  // Trigger search with updated index
  };

  // Go to the previous page of search results
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setIndex(index - 5);
      searchTracks({ preventDefault: () => {} });  // Trigger search with updated index
    }
  };

  return (
    <div className="search-bar">
      {/* Search form */}
      <form onSubmit={searchTracks}>
        <input ref={inputRef} type="text" placeholder="Search" />
        <button type="submit">Search</button>
      </form>

      {/* Display search results */}
      <div className="search-results">
        {loadingSearch ? (
          <LoadingResults />
        ) : results.data.length === 0 ? (
          <p>No results found</p>
        ) : (
          <ul>
            {results.data.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </ul>
        )}

        {/* Pagination controls */}
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button onClick={nextPage} disabled={results.data.length < 5}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
