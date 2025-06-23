import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Package, Users, Truck } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'package' | 'client' | 'courier';
  title: string;
  subtitle: string;
  url: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar paquetes, clientes...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'package',
      title: 'ITB240615001',
      subtitle: 'Juan Pérez - En tránsito',
      url: '#tracking?package=1'
    },
    {
      id: '2',
      type: 'client',
      title: 'María González',
      subtitle: 'maria.gonzalez@gmail.com',
      url: '#clients/profile/2'
    },
    {
      id: '3',
      type: 'courier',
      title: 'Carlos Ramírez',
      subtitle: 'Zona Centro - Disponible',
      url: '#couriers/profile/3'
    }
  ];

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    if (onSearch) {
      onSearch(value);
    }
    
    performSearch(value);
  }, [onSearch, performSearch]);

  // Handle result click
  const handleResultClick = useCallback((result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    window.location.hash = result.url.replace('#', '');
  }, []);

  // Handle clear
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  // Handle escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon for result type
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'package':
        return <Package className="w-4 h-4 text-blue-400" />;
      case 'client':
        return <Users className="w-4 h-4 text-green-400" />;
      case 'courier':
        return <Truck className="w-4 h-4 text-purple-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="
            w-full pl-10 pr-10 py-2.5 
            bg-white/10 backdrop-blur-sm 
            border border-white/20 rounded-xl
            text-white placeholder-white/60
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
            transition-all duration-200
          "
        />
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 transform -translate-y-1/2
              p-1 rounded-full hover:bg-white/20 transition-colors
            "
          >
            <X className="w-3 h-3 text-white/60" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="
          absolute top-full left-0 right-0 mt-2 
          bg-white/10 backdrop-blur-xl border border-white/20 
          rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto
        ">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-white/60 text-sm">Buscando...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="
                    w-full px-4 py-3 text-left 
                    hover:bg-white/10 transition-colors
                    flex items-center space-x-3
                    border-b border-white/5 last:border-b-0
                  "
                >
                  {getResultIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{result.title}</p>
                    <p className="text-white/60 text-sm truncate">{result.subtitle}</p>
                  </div>
                  <div className="text-white/40">
                    <span className="text-xs capitalize">{result.type}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-4 text-center">
              <Search className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 text-sm">No se encontraron resultados</p>
              <p className="text-white/40 text-xs mt-1">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}

          {/* Quick Actions */}
          {!isLoading && query.length < 2 && (
            <div className="py-2">
              <div className="px-4 py-2">
                <p className="text-white/40 text-xs uppercase tracking-wide">Acciones Rápidas</p>
              </div>
              {[
                { icon: Package, label: 'Crear nuevo paquete', url: '#packages/new' },
                { icon: Users, label: 'Registrar cliente', url: '#clients/new' },
                { icon: Search, label: 'Tracking avanzado', url: '#tracking' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      window.location.hash = action.url.replace('#', '');
                      setIsOpen(false);
                    }}
                    className="
                      w-full px-4 py-3 text-left 
                      hover:bg-white/10 transition-colors
                      flex items-center space-x-3
                    "
                  >
                    <Icon className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;