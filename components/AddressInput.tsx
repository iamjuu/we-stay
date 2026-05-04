'use client';

import { useState, useEffect, useRef } from 'react';

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface AddressInputProps {
  onAddressSelect: (address: string) => void;
  disabled?: boolean;
  darkMode?: boolean;
}

export default function AddressInput({ onAddressSelect, disabled, darkMode = false }: AddressInputProps) {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasSelected, setHasSelected] = useState(false); // Track if user just selected an address
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced autocomplete fetch
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't fetch autocomplete if user just selected an address
    if (hasSelected) {
      return;
    }

    if (input.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/autocomplete?input=${encodeURIComponent(input)}`);
        const data = await response.json();
        
        if (data.predictions && data.predictions.length > 0) {
          setPredictions(data.predictions);
          setShowDropdown(true);
          setSelectedIndex(-1);
        } else {
          setPredictions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, hasSelected]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (prediction: Prediction) => {
    setHasSelected(true); // Mark that user selected an address
    setInput(prediction.description);
    setShowDropdown(false);
    setPredictions([]);
    onAddressSelect(prediction.description);
  };

  // Reset hasSelected when user starts typing again
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasSelected(false);
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handleSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          disabled={disabled}
          placeholder="Enter your O‘ahu, Hawai'i address"
          className={`w-full px-4 py-3 text-lg border-2 rounded-lg
                     outline-none transition-all duration-200
                     disabled:cursor-not-allowed backdrop-blur-sm
                     ${darkMode
                       ? 'bg-black/60 border-white text-white placeholder:text-white/40 focus:border-[#42B0A8] focus:ring-2 focus:ring-[#42B0A8]/20 disabled:bg-black/30'
                       : 'bg-white border-black text-black placeholder:text-gray-400 focus:border-[#42B0A8] focus:ring-2 focus:ring-[#42B0A8]/20 disabled:bg-gray-100 shadow-md'
                     }`}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${darkMode ? 'border-[#42B0A8]' : 'border-[#42B0A8]'}`} />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-80 overflow-y-auto backdrop-blur-md
                     ${darkMode
                       ? 'bg-black/80 border border-white'
                       : 'bg-white border border-black'
                     }`}
        >
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              onClick={() => handleSelect(prediction)}
              className={`w-full px-4 py-3 text-left transition-colors duration-150
                         last:border-b-0
                         ${darkMode
                           ? `border-b border-white/20 hover:bg-white/10 ${index === selectedIndex ? 'bg-white/10' : ''}`
                           : `border-b border-gray-100 hover:bg-[#42B0A8]/10 ${index === selectedIndex ? 'bg-[#42B0A8]/10' : ''}`
                         }`}
            >
              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {prediction.structured_formatting?.main_text || prediction.description.split(',')[0]}
              </div>
              <div className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                {prediction.structured_formatting?.secondary_text ||
                 prediction.description.split(',').slice(1).join(',')}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className={`mt-2 text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
        Start typing an address in Hawaii to see suggestions
      </p>
    </div>
  );
}




