import React, { useState } from "react";
import { Search as SearchIcon, ChevronDown } from "lucide-react";

const StationDropdown = ({ stations, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = stations.filter(
    (s) =>
      (s.station_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.station_id || "").toLowerCase().includes(search.toLowerCase()),
  );

  const selectedStation = stations.find((s) => s.station_id === selected);
  const selectedName = selectedStation
    ? `${selectedStation.station_name} (${selectedStation.station_id})`
    : selected;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 rounded border bg-input cursor-pointer flex justify-between items-center"
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selectedName || "Select Police Station..."}
        </span>
        <ChevronDown size={16} className="text-muted-foreground" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b bg-gray-50">
            <div className="flex items-center bg-white border rounded px-2">
              <SearchIcon size={14} className="text-gray-400 mr-2" />
              <input
                className="w-full p-1 outline-none text-sm"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ul className="overflow-y-auto flex-1 max-h-40">
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <li
                  key={s.station_id}
                  onClick={() => {
                    onSelect(s.station_id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="p-2 hover:bg-violet-50 cursor-pointer text-sm border-b last:border-b-0 text-gray-800"
                >
                  <span className="font-semibold">{s.station_name}</span>
                  <span className="text-gray-500 ml-1">({s.station_id})</span>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500 text-xs text-center">
                No stations found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StationDropdown;
