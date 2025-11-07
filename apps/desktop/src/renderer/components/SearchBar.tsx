import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface SearchResult {
  type: 'company' | 'contact' | 'deal' | 'task';
  id: number;
  title: string;
  subtitle?: string;
}

interface SearchBarProps {
  onResultClick?: (result: SearchResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const delaySearch = setTimeout(() => {
      performSearch(query);
    }, 300); // debounce 300ms

    return () => clearTimeout(delaySearch);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      const data = response.results || [];
      setResults(data);
      setShowResults(data.length > 0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setShowResults(false);
    if (onResultClick) {
      onResultClick(result);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'company':
        return '🏢';
      case 'contact':
        return '👤';
      case 'deal':
        return '💼';
      case 'task':
        return '✅';
      default:
        return '📄';
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Otsi ettevõtteid, kontakte, tehinguid, ülesandeid..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
        />
        {loading && <span className="search-loading">🔍</span>}
      </div>

      {showResults && (
        <div className="search-results">
          {results.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="search-result-item"
              onClick={() => handleResultClick(result)}
            >
              <span className="result-icon">{getResultIcon(result.type)}</span>
              <div className="result-content">
                <div className="result-title">{result.title}</div>
                {result.subtitle && (
                  <div className="result-subtitle">{result.subtitle}</div>
                )}
              </div>
              <span className="result-type">{result.type}</span>
            </div>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !loading && (
        <div className="search-results">
          <div className="search-no-results">Tulemusi ei leitud</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

