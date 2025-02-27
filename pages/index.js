import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [availability, setAvailability] = useState([]);

  const locations = [
    { name: "Blaine, WA", id: 5020 },
    { name: "Derby Line, VT", id: 5223 },
    { name: "Calais, ME", id: 5500 },
  ];

  const checkAvailability = async () => {
    let results = [];
    for (let loc of locations) {
      try {
        const response = await axios.get(
          `https://ttp.cbp.dhs.gov/schedulerapi/slot-availability?locationId=${loc.id}`
        );
        if (response.data.availableSlots.length > 0) {
          results.push({
            location: loc.name,
            slot: response.data.availableSlots[0].startTimestamp,
          });
        }
      } catch (error) {
        console.error(`Error checking ${loc.name}:`, error);
      }
    }
    setAvailability(results);
  };

  useEffect(() => {
    checkAvailability();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Nexus Appointment Availability</h1>
      {availability.length > 0 ? (
        <ul>
          {availability.map((slot, index) => (
            <li key={index}>
              {slot.location}: {slot.slot}
            </li>
          ))}
        </ul>
      ) : (
        <p>No available slots found.</p>
      )}
      <button onClick={checkAvailability} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Refresh
      </button>
    </div>
  );
}
