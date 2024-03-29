import React, { useState, useEffect } from 'react';

const DisplayDDI = ({ submittedDrugs }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [processableDrugs, setProcessableDrugs] = useState([]);
    const [nonProcessableDrugs, setNonProcessableDrugs] = useState([]);
    const [drugPairs, setDrugPairs] = useState([]);

    useEffect(() => {
        // Extract drug names from submittedDrugs
        const extractedDrugs = submittedDrugs.reduce((acc, tablet) => {
            const drugs = tablet.Drugs ? tablet.Drugs.split(',').map(drug => drug.trim()).filter(drug => drug) : [];
            return acc.concat(drugs);
        }, []);
        const uniqueDrugs = [...new Set(extractedDrugs)].filter(drug => drug);
        
        // Automatically call filterDrugs when allDrugs changes
        if (uniqueDrugs.length > 0) {
            filterDrugs(uniqueDrugs);
        } else {
            // Clear previous data if there are no drugs
            setProcessableDrugs([]);
            setNonProcessableDrugs([]);
            setDrugPairs([]);
        }
    }, [submittedDrugs]);

    const filterDrugs = async (drugNames) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5001/filter-drugs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ drugs: drugNames }),
            });

            if (!response.ok) {
                throw new Error('Failed to filter drugs');
            }

            const data = await response.json();
            setProcessableDrugs(data.processable_drugs || []);
            setNonProcessableDrugs(data.non_processable_drugs || []);
            setDrugPairs(data.predictions || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getImageUrl = (drugName) => {
        return `/images/${drugName.replace(/ /g, '_')}.png`;
    };

    // Only display content if there are submitted drugs
    if (submittedDrugs.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="bg-gray bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-6">
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {nonProcessableDrugs.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold">Currently Unavailable Drugs:</h3>
                        <ul className="list-disc pl-5">
                            {nonProcessableDrugs.map((drug, index) => (
                                <li key={index}>{drug}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {drugPairs.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-center mb-4 text-blue-200">Drug Pairs and DDI Predictions</h3>
                        <ul className="list-disc pl-5 space-y-2">
                        {drugPairs.map(({ drug_pair, label, statement }, index) => (
                            <li key={index} className="bg-white bg-opacity-40 rounded-md p-3 shadow flex flex-col md:flex-row items-center gap-4 justify-center">
                                <div className="text-center">
                                    <img src={getImageUrl(drug_pair.split(' and ')[0])} alt={drug_pair.split(' and ')[0]} className=" text-black w-20 h-20 object-cover mx-auto" />
                                    <span className="text-black  block font-bold">{drug_pair.split(' and ')[0]}</span>
                                </div>
                                <span className="text-black  font-bold text-xl">+</span>
                                <div className="text-center">
                                    <img src={getImageUrl(drug_pair.split(' and ')[1])} alt={drug_pair.split(' and ')[1]} className="w-20 h-20 object-cover mx-auto" />
                                    <span className="text-black  block font-bold">{drug_pair.split(' and ')[1]}</span>
                                </div>
                                <div>
                                    <span className={`block mt-4 md:mt-0 ${label === 'No DDI' ? 'text-black font-bold' : 'text-black font-bold'}`}>
                                        {statement.replace('{drug_a}', drug_pair.split(' and ')[0]).replace('{drug_b}', drug_pair.split(' and ')[1])}
                                    </span>
                                </div>
                            </li>
                        ))}

                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayDDI;
