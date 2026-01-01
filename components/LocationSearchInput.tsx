import { useState, useEffect, useRef } from 'react';

interface Location {
  id: string;
  zipCode: string;
  city: string;
  district: string;
  province: string;
}

const LocationSearchInput = ({ 
  label, 
  name, 
  defaultValue, 
  placeholder,
  onSelect,
  onChange
}: { 
  label: string; 
  name: string; 
  defaultValue?: string; 
  placeholder?: string;
  onSelect?: (loc: Location) => void;
  onChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState(defaultValue || '');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setValue(query);
    if (onChange) onChange(query);

    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(`/api/locations?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Failed to fetch locations');
    }
  };

  const handleSelect = (loc: Location) => {
    setValue(loc.city);
    setShowDropdown(false);
    if (onChange) onChange(loc.city);
    if (onSelect) onSelect(loc);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
        autoComplete="off"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((loc, idx) => (
            <button
              key={`${loc.id}-${idx}`}
              type="button"
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <span className="font-semibold text-blue-600">{loc.zipCode}</span>
              <span className="mx-2">-</span>
              <span>{loc.district}, {loc.city}, {loc.province}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
