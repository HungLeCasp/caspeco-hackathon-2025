import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  X,
  User, 
  FileText,
  Loader2,
  Building2,
  MapPin,
  Tag,
  ShoppingCart,
  Globe,
  ExternalLink,
  ChevronRight,
  Users
} from "lucide-react";
import { performSearch } from "./api/search";
import type { SearchResult, SearchModalProps, IconType } from "./types";

export default function SearchModal({ isOpen, onClose }: SearchModalProps): React.JSX.Element | null {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to get appropriate icon based on type
  const getIconForType = (type?: string): React.ReactNode => {
    if (!type) return <FileText size={16} className="text-gray-500" />;
    
    const normalizedType = type.toLowerCase() as IconType;
    const iconMap: Record<IconType, React.ReactNode> = {
      'user': <User size={16} className="text-blue-500" />,
      'company': <Building2 size={16} className="text-purple-500" />,
      'area': <MapPin size={16} className="text-green-500" />,
      'brand': <Tag size={16} className="text-orange-500" />,
      'checkout': <ShoppingCart size={16} className="text-red-500" />,
      'location': <Globe size={16} className="text-indigo-500" />,
      'organization': <Users size={16} className="text-teal-500" />
    };

    return iconMap[normalizedType] || <FileText size={16} className="text-gray-500" />;
  };

  // Search function that calls the API
  const handleSearch = async (query: string): Promise<void> => {
    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query.trim() === "") {
      setSearchResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Create new abort controller for this search
    abortControllerRef.current = new AbortController();

    try {
      const results = await performSearch(query, {
        signal: abortControllerRef.current.signal
      });
      
      setSearchResults(results || []);
    } catch (err) {
      console.error('Search error:', err);
      
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Failed to search. Please try again.');
        setSearchResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
      // Cancel any ongoing search when query changes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus the input when modal opens
      const input = document.getElementById("search-input") as HTMLInputElement;
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      
      // Cancel any ongoing search
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 px-4 py-4">
            <Search size={20} className="text-gray-400 mr-3 flex-shrink-0" />
            <input
              id="search-input"
              type="text"
              placeholder="Type at least 3 characters to search..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full text-lg outline-none placeholder-gray-400 text-gray-900"
              autoComplete="off"
            />
            <button
              onClick={onClose}
              className="ml-3 p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() === "" ? (
              <div className="px-4 py-12 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Start typing to search</p>
                <p className="text-sm">Search for name, type or category</p>
              </div>
            ) : searchQuery.trim().length < 3 ? (
              <div className="px-4 py-12 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Keep typing...</p>
                <p className="text-sm">Type at least 3 characters to search</p>
              </div>
            ) : isLoading ? (
              <div className="px-4 py-12 text-center text-gray-500">
                <Loader2 size={48} className="mx-auto mb-4 text-gray-300 animate-spin" />
                <p className="text-lg mb-2">Searching...</p>
                <p className="text-sm">Please wait while we search for results</p>
              </div>
            ) : error ? (
              <div className="px-4 py-12 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-red-300" />
                <p className="text-lg mb-2 text-red-600">Search Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">No results found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((item, index) => {
                  const hasValidUrl = item.urlPath && 
                                     item.urlPath.trim() !== '' && 
                                     !item.urlPath.toLowerCase().includes('not implemented');
                  
                  const isExternalUrl = hasValidUrl && item.urlPath && 
                                       (item.urlPath.startsWith('http://') || item.urlPath.startsWith('https://'));
                  
                  const content = (
                    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors w-full">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          {item.icon || getIconForType(item.type || item.Type || item.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {item.name || item.Name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.type || item.Type || 'Unknown'}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.status || 'Active'}
                        </span>
                        {hasValidUrl && (
                          <div className="text-gray-400" title="Click to open">
                            {isExternalUrl ? 
                              <ExternalLink size={14} /> : 
                              <ChevronRight size={14} />
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  return hasValidUrl ? (
                    <a
                      key={item.id || index}
                      href={item.urlPath}
                      target={isExternalUrl ? '_blank' : '_self'}
                      rel={isExternalUrl ? 'noopener noreferrer' : undefined}
                      className="block hover:no-underline"
                      onClick={() => console.log("Selected item:", item)}
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={item.id || index}
                      className="cursor-default"
                      onClick={() => console.log("No URL available for this item or URL not implemented")}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with shortcuts */}
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                  <span>to select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                  <span>to close</span>
                </div>
              </div>
              <div className="text-gray-400">
                {searchResults.length > 0 && `${searchResults.length} results`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
