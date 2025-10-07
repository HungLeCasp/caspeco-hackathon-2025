import { useState } from "react";
import { Search, User, MapPin, BookOpen } from "lucide-react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = [ // this shoud call to API to get search result
    { id: 1, icon: <User size={20} />, title: "John Doe", subtitle: "User" }, // think we can create an mock UI for User View
    { id: 2, icon: <MapPin size={20} />, title: "John’s BBQ Spot", subtitle: "Location" }, // and we can create an mock UI Location view
    { id: 3, icon: <BookOpen size={20} />, title: "Lunch menu John’s BBQ Spot", subtitle: "Menu" },// and we can also create an mock UI Menu view as well

    //the api should returns the URL of the view. When clicking the result card, it will open corresponding result screen
  ];

  const filtered = results.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="relative w-[600px]">
        <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm bg-white">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(e.target.value.length > 0);
            }}
            className="w-full outline-none text-gray-700"
          />
        </div>

        {isOpen && (
          <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.subtitle}</div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 text-sm">Select</button>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-sm">No results found</div>
            )}

            <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-500 bg-gray-50">
              <div>↑↓ To navigate</div>
              <div>↵ To select</div>
              <div>esc To dismiss</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
