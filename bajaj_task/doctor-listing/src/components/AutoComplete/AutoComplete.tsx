import React, { useState, useEffect, useRef } from 'react';
import './AutoComplete.css';
import { Doctor } from '../../types';

interface AutoCompleteProps {
  doctors: Doctor[];
  onSearch: (searchTerm: string) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ doctors, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      onSearch('');
      return;
    }

    // Filter doctors whose names include the input value
    const filtered = doctors
      .filter(doctor => doctor.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 3);
      
    setSuggestions(filtered);
    // Don't show suggestions until user stops typing
    setShowSuggestions(false);
    
    // Update the search immediately when typing
    onSearch(value);
  };

  const handleSuggestionClick = (doctorName: string) => {
    setInputValue(doctorName);
    setShowSuggestions(false);
    onSearch(doctorName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      onSearch(inputValue);
    }
  };

  return (
    <div className="autocomplete-container" ref={wrapperRef}>
      <input
        data-testid="autocomplete-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search doctors by name..."
        className="autocomplete-input"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => handleSuggestionClick(doctor.name)}
              data-testid="suggestion-item"
              className="suggestion-item"
            >
              {doctor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
