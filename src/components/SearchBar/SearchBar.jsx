import React, { useRef, useState } from "react";
import { Kbd } from "@chakra-ui/react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { endPoints } from "../../utils/constants";
import { useTrackContext } from "../../context/trackContext";
import { Icon } from "../Stateless/Icon";
import { LoadingResults } from "../Stateless/Loading/LoadingResults";
import TrackCard from "../TrackCard/TrackCard";

const SearchBar = () => {
  const { setTracklist } = useTrackContext(); // Now this works because setTracklist is in context
  const URL_CORS = process.env.REACT_APP_CORS_PROXY || "https://cors-anywhere.herokuapp.com/"; // Use CORS proxy
  const URL_API = process.env.REACT_APP_API_URL;   

  const [results, setResults] = useState({ data: [] });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(1);
  const inputRef = useRef();

  const searchTracks = (e) => {
    e.preventDefault();
    setLoadingSearch(true);
    fetch(`${CORS_PROXY}${URL_SEARCH}${inputRef.current.value}&limit=5&index=0`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((rawData) => {
        console.log("Raw API response:", rawData);
        try {
          const parsedData = JSON.parse(rawData);
          setLoadingSearch(false);
          setIndex(1);
          setCurrentPage(1);
          setResults(parsedData);
          setTracklist(parsedData.data); // Set tracklist in context
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setLoadingSearch(false);
        }
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching tracks:", error);
      });
  };

  const nextSearch = () => {
    setLoadingSearch(true);
    fetch(`${CORS_PROXY}${results.next}`)
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
        setTracklist(data.data); // Set tracklist in context
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching next tracks:", error);
      });
  };

  const prevSearch = () => {
    setLoadingSearch(true);
    fetch(`${CORS_PROXY}${results.prev}`)
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
        setTracklist(data.data); // Set tracklist in context
      })
      .catch((error) => {
        setLoadingSearch(false);
        console.error("Error fetching previous tracks:", error);
      });
  };

  return (
    <div className="w-full max-w-2xl px-0 mx-auto lg:max-w-xl">
      <div className="px-4 py-6 space-y-5 lg:space-y-3 lg:py-0">
        <form onSubmit={searchTracks} className="relative overflow-visible">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-400 sm:text-sm">
            <Icon icon={faSearch} className="text-base" />
          </span>
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
              <div className="flex sm:flex-row flex-col space-y-1 sm:space-y-0 items-center justify-between px-4 py-3 mt-2.5 border-gray-200 rounded-lg bg-stone-900 sm:px-6">
                <div className="flex justify-between flex-1 w-full sm:hidden">
                  <button
                    onClick={prevSearch}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md border-stone-300 disabled:border-stone-600 text-stone-400 bg-stone-900 hover:bg-stone-800 disabled:hover:bg-stone-900 disabled:text-stone-600"
                  >
                    Previous
                  </button>
                  <p className="relative inline-flex items-center text-sm font-medium text-stone-300 bg-stone-900">
                    {currentPage}
                  </p>
                  <button
                    onClick={nextSearch}
                    disabled={currentPage === Math.ceil(results.total / 5)}
                    className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium border rounded-md border-stone-300 text-stone-400 bg-stone-900 hover:bg-stone-800 disabled:border-stone-600 disabled:hover:bg-stone-900 disabled:text-stone-600"
                  >
                    Next
                  </button>
                </div>
                <div className="flex justify-center w-full sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-stone-500">
                      Showing <span className="font-medium">{index}</span> to{" "}
                      <span className="font-medium">
                        {results.data.length === 5
                          ? results.data.length * currentPage
                          : 5 * (currentPage - 1) + results.data.length}
                      </span>{" "}
                      of <span className="font-medium">{results.total}</span>{" "}
                      results
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <nav
                      className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={prevSearch}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium border border-gray-300 text-stone-400 bg-stone-900 rounded-l-md hover:bg-stone-800 disabled:hover:bg-stone-900 disabled:text-stone-700"
                      >
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L10.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <p className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-stone-300 bg-stone-900">
                        {currentPage}
                      </p>
                      <button
                        onClick={nextSearch}
                        disabled={currentPage === Math.ceil(results.total / 5)}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium border border-gray-300 text-stone-400 bg-stone-900 rounded-r-md hover:bg-stone-800 disabled:border-stone-600 disabled:hover:bg-stone-900 disabled:text-stone-600"
                      >
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 5.293a1 1 0 011.414 0L10.414 8l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a1 1 0 000-1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
