import React, { createContext, useContext, useState, useEffect } from 'react';

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
    const [playlist, setPlaylist] = useState(() => {
        // Try to load the playlist from local storage or start with an empty array
        const savedPlaylist = localStorage.getItem('playlist');
        return savedPlaylist ? JSON.parse(savedPlaylist) : [];
    });

    const [currentTrack, setCurrentTrack] = useState(() => {
        // Try to load the current track from local storage or start with null
        const savedCurrentTrack = localStorage.getItem('currentTrack');
        return savedCurrentTrack ? JSON.parse(savedCurrentTrack) : null;
    });

    useEffect(() => {
        // Save the playlist and current track to local storage whenever they change
        localStorage.setItem('playlist', JSON.stringify(playlist));
        localStorage.setItem('currentTrack', JSON.stringify(currentTrack));
    }, [playlist, currentTrack]);

    const addTrackToPlaylist = (track) => {
        setPlaylist([track]); // This replaces the playlist with only the new track
    };

    const removeTrackFromPlaylist = (trackId) => {
        setPlaylist(prev => prev.filter(track => track.track_id !== trackId));
    };

    const setCurrent = (track) => {
        // Clear the playlist and set the current track
        setPlaylist([]); // This clears the playlist
        setCurrentTrack(track);
    };

    const value = {
        playlist,
        currentTrack,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        setCurrent,
    };

    return (
        <PlaylistContext.Provider value={value}>
            {children}
        </PlaylistContext.Provider>
    );
};
