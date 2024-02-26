import React, { createContext, useContext, useState } from 'react';

// Create a Context for the drug data
const DrugContext = createContext();

// Custom hook to use the drug context
export const useDrugs = () => useContext(DrugContext);

// Provider component that encapsulates the state and functions
export const DrugProvider = ({ children }) => {
    // State to hold submitted drugs
    const [submittedDrugs, setSubmittedDrugs] = useState([]);

    // Function to remove a submitted drug by its id
    const handleRemoveSubmittedDrug = (drugId) => {
        setSubmittedDrugs(currentDrugs => currentDrugs.filter(drug => drug._id !== drugId));
    };

    // Function to add a new submitted drug
    const addSubmittedDrug = (drug) => {
        setSubmittedDrugs(currentDrugs => [...currentDrugs, drug]);
    };

    // Function to clear all submitted drugs
    const clearSubmittedDrugs = () => {
        setSubmittedDrugs([]);
    };

    // The value provided to the context consumers
    const value = {
        submittedDrugs,
        handleRemoveSubmittedDrug,
        addSubmittedDrug,
        clearSubmittedDrugs,
    };

    return (
        <DrugContext.Provider value={value}>
            {children}
        </DrugContext.Provider>
    );
};
