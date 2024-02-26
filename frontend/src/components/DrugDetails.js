// // src/components/DrugDetails.js
// import { useSelectedDrugs } from '../context/DrugContext';
// import React, { useEffect, useState } from 'react';

// const DrugDetails = () => {
//     const { selectedDrugs, detailsSubmitted } = useSelectedDrugs();
//     const [drugDetails, setDrugDetails] = useState([]);
  
//     useEffect(() => {
//       if (detailsSubmitted) {
//         // Assuming a function to fetch details for selected drugs
//         fetchDrugDetails(selectedDrugs).then(setDrugDetails);
//       }
//     }, [selectedDrugs, detailsSubmitted]);
  
//     const fetchDrugDetails = async (selectedDrugs) => {
//         // Assuming the server accepts multiple drug names in the query string
//         const drugNames = selectedDrugs.map(drug => drug.name).join(',');
        
//         try {
//           const response = await fetch(`/drugs/details?names=${encodeURIComponent(drugNames)}`);
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           const details = await response.json();
//           return details; // Assuming the server returns an array of drug details
//         } catch (error) {
//           console.error("Failed to fetch drug details:", error);
//           return []; // Return an empty array on error
//         }
//       };
      

//   // Helper function to render details of each drug
//   const renderDrugDetails = () => drugDetails.map((drug) => (
//     <div key={drug._id} className="mb-8">
//       <h3 className="text-lg font-bold mb-2">{drug.Medicine_Name}</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <p><strong>Prescription:</strong> {drug.Prescription}</p>
//         <p><strong>Type of Sell:</strong> {drug.Type_of_Sell}</p>
//         <p><strong>Manufacturer:</strong> {drug.Manufacturer}</p>
//         <p><strong>Composition:</strong> {drug.Composition}</p>
//         <p><strong>MRP:</strong> {drug.MRP}</p>
//         <p><strong>Uses:</strong> {drug.Uses}</p>
//         <p><strong>Alternate Medicines:</strong> {drug.Alternate_Medicines}</p>
//         <p><strong>Side Effects:</strong> {drug.Side_Effects}</p>
//         <p><strong>How to Use:</strong> {drug.How_to_Use}</p>
//         <p><strong>Chemical Class:</strong> {drug.Chemical_Class}</p>
//         <p><strong>Habit Forming:</strong> {drug.Habit_Forming}</p>
//         <p><strong>Therapeutic Class:</strong> {drug.Therapeutic_Class}</p>
//         <p><strong>Action Class:</strong> {drug.Action_Class}</p>
//         <p><strong>How It Works:</strong> {drug.How_It_Works}</p>
//       </div>
//     </div>
//   ));

//   return (
//     <div className="p-4">
//       {selectedDrugs.length > 0 ? (
//         selectedDrugs.map((drug) => (
//           <div key={drug.id} className="border-b-2 pb-4">
//             {renderDrugDetails(drug)}
//           </div>
//         ))
//       ) : (
//         <p>No drugs selected.</p>
//       )}
//     </div>
//   );
// };

// export default DrugDetails;
