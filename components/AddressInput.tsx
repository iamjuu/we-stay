'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

export type AddressInputHandle = {
  getValue: () => string;
};

interface AddressInputProps {
  onAddressSelect: (address: string) => void;
  /** Fires on every keystroke with the raw input value (e.g. detect clear). */
  onValueChange?: (value: string) => void;
  /** Enter runs eligibility check with the current input when not choosing a suggestion. */
  onEnterCheck?: (trimmedInput: string) => void;
  disabled?: boolean;
  darkMode?: boolean;
  hideHelperText?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  /**
   * With `darkMode`, skip opaque black fills so the field can sit on a glass/dark pill
   * (hero eligibility). Text/placeholder colors should come from `inputClassName`.
   */
  transparentDarkField?: boolean;
}

const AddressInput = forwardRef<AddressInputHandle, AddressInputProps>(
  function AddressInput(
    {
      onAddressSelect,
      onValueChange,
      onEnterCheck,
      disabled,
      darkMode = false,
      hideHelperText = false,
      wrapperClassName = '',
      inputClassName = '',
      transparentDarkField = false,
    },
    ref
  ) {
    const [input, setInput] = useState('');
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [hasSelected, setHasSelected] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => input.trim(),
      }),
      [input]
    );

    useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

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
      setHasSelected(true);
      setInput(prediction.description);
      setShowDropdown(false);
      setPredictions([]);
      onAddressSelect(prediction.description);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasSelected(false);
      const next = e.target.value;
      setInput(next);
      onValueChange?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          if (!showDropdown || predictions.length === 0) return;
          e.preventDefault();
          setSelectedIndex(prev => (prev < predictions.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          if (!showDropdown || predictions.length === 0) return;
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (showDropdown && predictions.length > 0) {
            const idx = selectedIndex >= 0 ? selectedIndex : 0;
            handleSelect(predictions[idx]);
            return;
          }
          onEnterCheck?.(input.trim());
          break;
        case 'Escape':
          if (!showDropdown) return;
          setShowDropdown(false);
          break;
      }
    };

    const darkTransparentShell =
      darkMode && transparentDarkField ? 'border-0 rounded-lg' : 'border-2 rounded-lg';

    const darkModeBase = transparentDarkField
      ? 'bg-transparent text-white placeholder:text-white/40 outline-none focus:border-transparent focus:ring-0 focus:ring-transparent disabled:bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(0_0_0/0)] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit] [&:-webkit-autofill]:[transition:background-color_99999s_ease-out]'
      : 'bg-black/60 border-white text-white placeholder:text-white/40 focus:border-[#42B0A8] focus:ring-2 focus:ring-[#42B0A8]/20 disabled:bg-black/30';

    const baseInputClass = `w-full px-4 py-3 text-lg ${darkTransparentShell}
                     outline-none transition-all duration-200
                     disabled:cursor-not-allowed 
                     ${darkMode
                       ? darkModeBase
                       : 'bg-white border-black text-black placeholder:text-gray-400 focus:border-[#42B0A8] focus:ring-2 focus:ring-[#42B0A8]/20 disabled:bg-gray-100 shadow-md'
                     }`;

    return (
      <div className={`relative w-full ${wrapperClassName}`}>
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
            className={`${baseInputClass} ${inputClassName}`}
            style={
              darkMode && transparentDarkField
                ? {
                    backgroundColor: 'transparent',
                    ...(disabled ? { opacity: 1 } : {}),
                  }
                : undefined
            }
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div
                className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${darkMode ? 'border-[#42B0A8]' : 'border-[#42B0A8]'}`}
              />
            </div>
          )}
        </div>

        {showDropdown && predictions.length > 0 && (
          <div
            ref={dropdownRef}
            className={`scrollbar absolute inset-x-0 top-full z-[60] mt-[9px] max-h-80 min-w-0 w-full overflow-y-auto rounded-lg shadow-lg
                     ${darkMode ? 'border border-white/25 bg-[#0c1420]/95' : 'border border-black bg-white'}`}
          >
            {predictions.map((prediction, index) => (
              <button
                key={prediction.place_id}
                type="button"
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

        {!hideHelperText && (
          <p className={`mt-2 text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
            Start typing an address in Hawaii to see suggestions
          </p>
        )}
      </div>
    );
  }
);

export default AddressInput;
