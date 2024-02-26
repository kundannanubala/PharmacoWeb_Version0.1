// import React, { useState } from 'react';
// import { useSelectedDrugs } from '../context/DrugContext';

// const SearchBarAndResults = () => {
//   const [query, setQuery] = useState('');
//   const { selectedDrugs, addDrug, submitSelectedDrugs } = useSelectedDrugs();
//   const [error, setError] = useState('');

//   const handleAddDrug = () => {
//     if (!query) {
//       setError('Please enter a drug name before adding.');
//       return;
//     }
//     if (selectedDrugs.length >= 6) {
//       alert('You can select up to 6 tablets only.');
//       return;
//     }
//     // Assuming a drug object requires a name and a pseudo id
//     // Adjust based on your actual data structure
//     addDrug({ name: query, id: Date.now() });
//     setQuery(''); // Clear the search input for new entries
//     setError(''); // Clear any existing error
//   };

//   const handleSubmit = () => {
//     if (selectedDrugs.length === 0) {
//       alert('Please add at least one tablet before submitting.');
//       return;
//     }
//     submitSelectedDrugs(); // Implement this function to trigger the desired action
//   };

//   return (
//     <div>
//       <div className="flex items-center space-x-2">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Enter drug names..."
//           className="border p-2"
//         />
//         <button onClick={handleAddDrug} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add</button>
//       </div>
//       {error && <div className="text-red-500 mt-2">{error}</div>}
//       {selectedDrugs.length > 0 && (
//         <div>
//           <ul className="mt-4">
//             {selectedDrugs.map((drug, index) => (
//               <li key={index} className="mt-2">{drug.name}</li>
//             ))}
//           </ul>
//           <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Submit</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBarAndResults;
