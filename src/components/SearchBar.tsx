import React, { useState, useEffect } from 'react';
import '../styles/SearchBar.scss';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedTerm, setDebouncedTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    setIsSearching(false);
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    setIsSearching(false);
  };

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Trigger search with debounced term
  useEffect(() => {
    if (debouncedTerm !== searchTerm) return;

    onSearch(debouncedTerm);
    setIsSearching(false);
  }, [debouncedTerm, onSearch]);

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search logs..."
            className="search-input"
            aria-label="Search logs"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {isSearching && <div className="search-indicator">Searching...</div>}
    </div>
  );
};

export default SearchBar;
