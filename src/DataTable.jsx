import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus, 
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
import SearchModal from "./SearchModal";

export default function DataTable() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
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

  // Sample data with various icons and types
  const tableData = [
    { 
      id: 1, 
      icon: <User size={16} className="text-blue-500" />, 
      name: "John Doe - Desc", 
      type: "Member Guest", 
      status: "Active" 
    },
    { 
      id: 2, 
      icon: <User size={16} className="text-green-500" />, 
      name: "Anna Andersson - Desc", 
      type: "Member Guest", 
      status: "Active" 
    },
    { 
      id: 3, 
      icon: <Briefcase size={16} className="text-purple-500" />, 
      name: "Erik Eriksson - Desc", 
      type: "Employee", 
      status: "Active" 
    },
    { 
      id: 4, 
      icon: <Package size={16} className="text-orange-500" />, 
      name: "Premium Coffee Beans - Desc", 
      type: "Article", 
      status: "Active" 
    },
    { 
      id: 5, 
      icon: <CreditCard size={16} className="text-red-500" />, 
      name: "VAT 25% - Desc", 
      type: "VAT", 
      status: "Active" 
    },
    { 
      id: 6, 
      icon: <ShoppingBag size={16} className="text-indigo-500" />, 
      name: "#1337 Jane Doe (5 guests) - Desc", 
      type: "Order", 
      status: "Active" 
    },
    { 
      id: 7, 
      icon: <Users size={16} className="text-teal-500" />, 
      name: "Annual Meeting 2025 - Desc", 
      type: "Conference", 
      status: "Active" 
    },
    { 
      id: 8, 
      icon: <User size={16} className="text-pink-500" />, 
      name: "Maria Larsson - Desc", 
      type: "Member Guest", 
      status: "Active" 
    },
    { 
      id: 9, 
      icon: <Briefcase size={16} className="text-yellow-500" />, 
      name: "Peter Petterson - Desc", 
      type: "Employee", 
      status: "Active" 
    },
    { 
      id: 10, 
      icon: <FileText size={16} className="text-gray-500" />, 
      name: "Kitchen Equipment - Desc", 
      type: "Article", 
      status: "Active" 
    },
    { 
      id: 11, 
      icon: <Calendar size={16} className="text-blue-600" />, 
      name: "Summer Conference 2025 - Desc", 
      type: "Conference", 
      status: "Active" 
    },
    { 
      id: 12, 
      icon: <ShoppingBag size={16} className="text-emerald-500" />, 
      name: "#2048 Alex Johnson (2 guests) - Desc", 
      type: "Order", 
      status: "Active" 
    }
  ];

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
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
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
            ))}
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
        data={tableData}
      />
    </div>
  );
}
