import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SubmittedDrugsDisplay from './components/SubmittedDrugsDisplay';
import DisplayDDI from './components/DisplayDDI';

const MultiSearchTablets = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedTablets, setSelectedTablets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submittedDrugs, setSubmittedDrugs] = useState([]);

    useEffect(() => {
        if (query) {
            fetchSuggestions(query);
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const fetchSuggestions = async (query) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/drugs/search?names=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            setError(error.message);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTablet = (tablet) => {
        if (selectedTablets.length >= 6) {
            alert('You can only add up to 6 tablets.');
            return;
        }
        // Check if the tablet is already in the selectedTablets array
        const isTabletAlreadyAdded = selectedTablets.some(selectedTablet => selectedTablet._id === tablet._id);
        if (isTabletAlreadyAdded) {
            alert('Tablet already added.');
            return;
        }
        setSelectedTablets(prevTablets => [...prevTablets, tablet]);
        setQuery(''); // Clear the search input for new entries
    };
    

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/drugs/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ names: selectedTablets.map(tablet => tablet.Medicine_Name) }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch drug details');
            }

            const data = await response.json();
            setSubmittedDrugs(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveTablet = (index) => {
        const newSelectedTablets = [...selectedTablets];
        newSelectedTablets.splice(index, 1);
        setSelectedTablets(newSelectedTablets);
    };
    useEffect(() => {
        // Check if the selectedTablets array is empty
        if (selectedTablets.length === 0) {
            // If so, clear the submittedDrugs state
            setSubmittedDrugs([]);
        }
    }, [selectedTablets]); 
    

    return (
        <div >
            <Navbar/>
        <div 
            className="relative min-h-screen  mt-16" 
            style={{ 
                backgroundImage: 'url(/images/reduced_brightness_only_image.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backdropFilter: 'blur(500px)' // Apply the blur effect
            }}
        >
            <div className="mockup-browser border border-base-300 bg-gray-800">
            <div className="mockup-browser-toolbar flex justify-center">
                    <div className="flex items-center w-1/3 rounded-md shadow"> {/* Container centered and 1/3 width */}
                        <input
                            className="input flex-grow border border-r-0 pl-4 pr-4 rounded-l-md focus:outline-none py-6"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter tablet name..."
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4"
                            >
                                Clear {/* Clear icon */}
                            </button>
                        )}
                    </div>
            </div>

            </div>
            {/* Suggestions dropdown */}
            <div className="relative w-full flex justify-center"> {/* Container for center alignment */}
                <div className="absolute z-10 w-full max-w-md bg-gray bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg max-h-60 overflow-auto mt-1 rounded-lg">
                    {isLoading && <div className="text-center p-2">Loading...</div>}
                    <ul className="divide-y divide-gray-200">
                        {suggestions.map(suggestion => (
                            <li 
                                key={suggestion._id} 
                                onClick={() => handleAddTablet(suggestion)} 
                                className="text-white text-bold cursor-pointer hover:bg-pink-500 p-3"
                            >
                                {suggestion.Medicine_Name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


            {/* Rest of your component */}
            <div className="mt-2">
            {/*Selecteed Tablets Display*/}
            {selectedTablets.length > 0 && (
                <div className="max-w-md mt-8">
                    <div className="bg-gray bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Selected Tablets</h3>
                            <button 
                                className="btn  btn-xs" 
                                onClick={() => setSelectedTablets([])}>Clear All</button>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {selectedTablets.map((tablet, index) => (
                                <li key={index} className="py-2 flex justify-between items-center hover:bg-pink-500 hover:text-white transition duration-150 ease-in-out cursor-pointer">
                                    <span>{tablet.Medicine_Name}</span>
                                    <button 
                                        className="btn  btn-xs" 
                                        onClick={() => handleRemoveTablet(index)}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-center mt-6">
                            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {/*Submitted Tablets Details */}
            <SubmittedDrugsDisplay submittedDrugs={submittedDrugs} />
            <DisplayDDI submittedDrugs={submittedDrugs} />
            </div>                    
        </div>
        </div>
    )
};

export default MultiSearchTablets;