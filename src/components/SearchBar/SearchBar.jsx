// src/components/SearchBar/SearchBar.jsx

import React, { useRef, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { endPoints } from "../../utils/constants";
import { useTrackContext } from "../../context/trackContext";
import { Icon } from "../Stateless/Icon";
import { LoadingResults } from "../Stateless/Loading/LoadingResults";
import TrackCard from "../TrackCard/TrackCard";

const SearchBar = () => {
  const { setTracklist } = useTrackContext();

  const [results, setResults] = useState({ data: [] });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(1);
  const inputRef = useRef();

  const searchTracks = (e) => {
    e.preventDefault();
    setLoadingSearch(true);
  
    const URL_SEARCH = `${endPoints.URL_SEARCH_API}${inputRef.current.value}&limit=5&index=0`;
  
    fetch(URL_SEARCH)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((parsedData) => {
        setLoadingSearch(false);
        setIndex(1);
        setCurrentPage(1);
        setResults(parsedData);
        setTracklist(parsedData.data);
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching tracks:", error);
      });
  };

  const nextSearch = () => {
    setLoadingSearch(true);
    fetch(results.next.replace('https://api.deezer.com', ''))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoadingSearch(false);
        setIndex(index + 5);
        setCurrentPage(currentPage + 1);
        setResults(data);
        setTracklist(data.data);
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching next tracks:", error);
      });
  };

  const prevSearch = () => {
    setLoadingSearch(true);
    fetch(results.prev.replace('https://api.deezer.com', ''))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoadingSearch(false);
        setIndex(index - 5);
        setCurrentPage(currentPage - 1);
        setResults(data);
        setTracklist(data.data);
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching previous tracks:", error);
      });
  };

  return (
    <div>
      <form onSubmit={searchTracks}>
        <input ref={inputRef} type="text" placeholder="Search for tracks" />
        <button type="submit">
          <Icon icon={faSearch} />
        </button>
      </form>
      {loadingSearch && <LoadingResults />}
      <div>
        {results.data.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
      <div>
        <button onClick={prevSearch} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={nextSearch} disabled={!results.next}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchBar;