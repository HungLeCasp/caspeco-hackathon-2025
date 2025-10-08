import { useState, useEffect } from "react";
import { 
  Search, 
  X,
  User, 
  Briefcase, 
  ShoppingBag, 
  Receipt, 
  Package, 
  Users,
  FileText,
  Calendar,
  Settings,
  CreditCard
} from "lucide-react";

export default function SearchModal({ isOpen, onClose, data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchQuery, data]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus the input when modal opens
      const input = document.getElementById("search-input");
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
      setFilteredResults([]);
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
              placeholder="Search for name, type or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            ) : filteredResults.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">No results found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      // Handle item selection here
                      console.log("Selected item:", item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
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
                {filteredResults.length > 0 && `${filteredResults.length} results`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
