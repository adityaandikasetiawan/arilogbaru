import { useState, useEffect } from 'react';

const LocationInput = ({ label, name, defaultValue, required }: { label: string, name: string, defaultValue?: string, required?: boolean }) => {
  const [zipCode, setZipCode] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [combinedValue, setCombinedValue] = useState(defaultValue || '');
  const [suggestions, setSuggestions] = useState<Array<{ id: number; zipCode: string; district: string; city: string; province: string }>>([]);
  const [open, setOpen] = useState(false);

  const searchLocation = async (zip: string) => {
    if (zip.length < 5) return;
    try {
      const res = await fetch(`/api/locations?search=${zip}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data || []);
        const exact = (data || []).find((l: any) => String(l.zipCode) === zip);
        if (exact) {
          setDistrict(exact.district);
          setCity(exact.city);
          setProvince(exact.province);
        }
        setOpen((data || []).length > 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    // Format: "Detail Address, District, City, Province, ZipCode"
    const parts = [detailAddress, district, city, province].filter(p => p).join(', ');
    const full = parts ? `${parts}, ${zipCode}` : zipCode;
    setCombinedValue(full);
  }, [detailAddress, district, city, province, zipCode]);

  // Attempt to parse default value if it exists
  useEffect(() => {
    if (defaultValue) {
      const zipMatch = defaultValue.match(/\b(\d{5})\b$/);
      if (zipMatch) {
         const zip = zipMatch[1];
         setZipCode(zip);
         searchLocation(zip);
         
         // Try to extract detail address by removing the zip code
         // Legacy format likely: "City, Province ZipCode" or just "ZipCode"
         const detail = defaultValue.replace(new RegExp(`[\\s,]*${zip}$`), '');
         setDetailAddress(detail);
      } else {
         setDetailAddress(defaultValue);
      }
    }
  }, [defaultValue]);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(val);
    if (val.length === 5) {
      searchLocation(val);
    } else {
      setDistrict('');
      setCity('');
      setProvince('');
      setSuggestions([]);
      setOpen(false);
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetailAddress(e.target.value);
  };

  const handleSelect = (loc: { zipCode: string; district: string; city: string; province: string }) => {
    setZipCode(String(loc.zipCode || '').slice(0, 5));
    setDistrict(loc.district || '');
    setCity(loc.city || '');
    setProvince(loc.province || '');
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">{label}</label>
      <input type="hidden" name={name} value={combinedValue} />
      
      <div className="flex gap-4">
        <div className="w-1/3 relative">
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={handleZipChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
            maxLength={5}
          />
          {open && suggestions.length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
              {suggestions.map((s) => (
                <button
                  key={`${s.id}-${s.zipCode}`}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                >
                  <div className="text-sm text-gray-900">{s.zipCode}</div>
                  <div className="text-xs text-gray-600">{s.district}, {s.city}, {s.province}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-2/3 flex items-center bg-gray-50 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm">
          {city || province ? (
            <span>{district}, {city}, {province}</span>
          ) : (
            <span className="text-gray-400">Area info will appear here...</span>
          )}
        </div>
      </div>
      
      <div>
        <textarea
          placeholder="Detailed Address (Street name, number, RT/RW, etc.)"
          value={detailAddress}
          onChange={handleDetailChange}
          required={required}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none resize-none"
          rows={2}
        />
      </div>
    </div>
  );
};

export default LocationInput;
