import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  User, 
  FileText,
  Loader2,
  Building2,
  MapPin,
  Tag,
  ShoppingCart,
  Globe,
  RefreshCw,
  Users
} from "lucide-react";
import SearchModal from "./SearchModal";
import { performSearch } from "./api/search";
import type { TableItem, SearchResult, IconType } from "./types";

export default function DataTable(): React.JSX.Element {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get appropriate icon based on type (same as SearchModal)
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

  // Function to fetch data from API
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all data (using a broad query to get all results)
      // You may need to adjust this query based on your API's requirements
      const results: SearchResult[] = await performSearch('*', { 
        timeout: 10000,
        isGetAll: true 
      });
      
      // Transform API results to table format
      const transformedData: TableItem[] = results.map((item, index) => ({
        id: item.id || index + 1,
        icon: getIconForType(item.Type || item.type),
        name: item.Name || item.name || 'Unnamed Item',
        type: item.Type || item.type || 'Unknown',
        urlPath: item.UrlPath || item.urlPath || '',
        status: 'Active' // Default status since API doesn't provide this
      }));
      
      setTableData(transformedData);
    } catch (err) {
      console.error('Failed to fetch table data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data. Please try again.';
      setError(errorMessage);
      setTableData([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredData = tableData; // Show all data in main table, search happens in modal

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header/Toolbar */}
        <div className="flex items-center justify-between mb-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">Everything</h1>
          
          {/* Right-side controls */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div 
                className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-80 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search size={18} className="text-gray-400 mr-3" />
                <div className="w-full text-gray-500 select-none">
                  Search category...
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 ml-2">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">K</kbd>
                </div>
              </div>
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center gap-2">
              {/* Refresh button */}
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <RefreshCw size={20} className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              {/* Filter/Sort button */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter size={20} className="text-gray-600" />
              </button>
              
              {/* More options button */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
              
              {/* Add button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors ml-2">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Name
              </div>
              <div className="col-span-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Type
              </div>
              <div className="col-span-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="px-6 py-12 text-center">
                <Loader2 size={48} className="mx-auto mb-4 text-gray-300 animate-spin" />
                <p className="text-lg mb-2 text-gray-600">Loading data...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the latest information</p>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-red-300" />
                <p className="text-lg mb-2 text-red-600">Error Loading Data</p>
                <p className="text-sm text-gray-500">{error}</p>
                <button 
                  onClick={fetchData} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2 text-gray-600">No data available</p>
                <p className="text-sm text-gray-500">There are no items to display at the moment</p>
              </div>
            ) : (
              filteredData.map((item) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    // Handle item click - could navigate to item.urlPath
                    if (item.urlPath) {
                      console.log('Navigate to:', item.urlPath);
                      // You can add navigation logic here, e.g., using React Router
                      // navigate(item.urlPath);
                    }
                  }}
                >
                  {/* Name column with icon */}
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="text-gray-900 font-medium">
                      {item.name}
                    </div>
                  </div>
                  
                  {/* Type column */}
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-700">
                      {item.type}
                    </span>
                  </div>
                  
                  {/* Status column */}
                  <div className="col-span-3 flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Table Footer / Pagination could go here */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {filteredData.length} of {tableData.length} entries
          </div>
          <div className="flex items-center gap-2">
            {/* Pagination controls could be added here */}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}
