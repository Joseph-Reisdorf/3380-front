import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { search } = useLocation(); // Destructure to directly get search part of the location.\

  const { loggedIn, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
        if (!loggedIn) {
            navigate('/login');
        }
        else if (userRole !== 'a') {
            if (userRole !== 'l') {  
                navigate('/');
            }
        }
    }
  }, [loggedIn, userRole, loading, navigate]); 

  useEffect(() => {
    const fetchSearchResults = async () => {
      // Extract the 'search' query parameter from the URL
      const searchParams = new URLSearchParams(search);
      const searchTerm = searchParams.get('search');

      if (!searchTerm) {
        // If no search term is provided, you might want to set searchResults to an empty array or handle this case differently
        console.log('No search term provided');
        return;
      }

      try {
        // Make the request to your backend with the search term`${process.env.REACT_APP_BACK_URL}/back_end/Album/find/${albumId}`
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/search?search=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        // Here, you can handle errors, perhaps by setting an error state and displaying it
      }
    };

    fetchSearchResults();
  }, [search]); // This effect depends on `search`, so it runs again if the query string changes

  return (
    <div>
      {/* Show the search term in the header */}
      <h2>Search Results for "{new URLSearchParams(search).get('search')}"</h2>
      {searchResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {/* Ensure your backend provides a unique 'id' for each result to use as a key here */}
          {searchResults.map(result => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;

/*
// Search.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('term');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Make a request to  backend API to fetch search results based on searchTerm
    axios.get(`/search?term=${searchTerm}`)
      .then(response => {
        setSearchResults(response.data); 
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        // Handle errors,set error state
      });
  }, [searchTerm]);

  return (
    <div>
      <h2>Search Results for "{searchTerm}"</h2>
      {searchResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {searchResults.map(result => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search; */