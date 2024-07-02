// src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
        />
    );
};

export default SearchBar;
