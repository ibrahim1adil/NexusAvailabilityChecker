// pages/api/appointments.js
import axios from "axios";

const nexusLocations = {
  WA: [
    { name: "Blaine NEXUS and FAST Enrollment Center", id: 5020 },
    { name: "Blaine (Blaine, WA Nexus Enrollment)", id: 16764 },
  ],
  VT: [{ name: "Derby Line (Derby Line Enrollment Center)", id: 5223 }],
  ME: [
    { name: "Calais (Calais Enrollment Center)", id: 5500 },
    { name: "Houlton (Houlton Enrollment Center)", id: 5101 },
  ],
  // Add the rest of your locations here...
};

export default async function handler(req, res) {
  let results = {};

  for (const state in nexusLocations) {
    results[state] = [];

    for (const location of nexusLocations[state]) {
      try {
        const response = await axios.get(
          `https://ttp.cbp.dhs.gov/schedulerapi/slot-availability?locationId=${location.id}`
        );
        const slots = response.data.availableSlots;
        if (slots.length > 0) {
          results[state].push({
            location: location.name,
            nextAvailable: slots[0].startTimestamp,
          });
        }
      } catch (error) {
        console.error(`Error fetching data for ${location.name}`, error);
      }
    }
  }

  res.status(200).json(results);
}
