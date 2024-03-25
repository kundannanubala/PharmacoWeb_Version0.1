import React, { useState } from 'react';

function Feedback() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [firstVisit, setFirstVisit] = useState('');
  const [outputValidity, setOutputValidity] = useState('');
  const [placeOfWork, setPlaceOfWork] = useState('');
  const [designation, setDesignation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [drugCombination, setDrugCombination] = useState('');
  const [outputGiven, setOutputGiven] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');

const postFeedback = async (feedbackData) => {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    return response.json();
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedbackData = {
      fullName,
      email,
      firstVisit,
      outputValidity,
      placeOfWork,
      designation,
      phoneNumber,
      identityNumber,
      drugCombination,
      outputGiven,
      expectedOutput,
    };
    try {
      const result = await postFeedback(feedbackData);
      console.log(result);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 max-w-md mx-auto bg-gray-100 bg-opacity-50 rounded-lg shadow m-8">
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-gray-700 font-bold">
          Enter full name:
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold">
          Email address:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <fieldset className="mb-4">
        <legend className="font-bold text-gray-700">Did you visit the website for the first time?</legend>
        <div className="mt-2">
          <label className="inline-flex items-center mr-4 font-bold">
            <input
              type="radio"
              value="yes"
              checked={firstVisit === 'yes'}
              onChange={() => setFirstVisit('yes')}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 font-bold"
            />
            <span className="ml-2 text-sm text-gray-700">Yes</span>
          </label>
          <label className="inline-flex items-center font-bold">
            <input
              type="radio"
              value="no"
              checked={firstVisit === 'no'}
              onChange={() => setFirstVisit('no')}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">No</span>
          </label>
        </div>
      </fieldset>
      <div className="mb-4">
        <label htmlFor="outputValidity" className="block text-gray-700 font-bold">
          Do you think the output is valid?
        </label>
        <input
          type="text"
          id="outputValidity"
          value={outputValidity}
          onChange={(e) => setOutputValidity(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="placeOfWork" className="block text-gray-700 font-bold">
          Place of work:
        </label>
        <input
          type="text"
          id="placeOfWork"
          value={placeOfWork}
          onChange={(e) => setPlaceOfWork(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="designation" className="block text-gray-700 font-bold">
          Designation:
        </label>
        <input
          type="text"
          id="designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 font-bold">
          Phone Number:
        </label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="identityNumber" className="block text-gray-700 font-bold">
          Identity No.:
        </label>
        <input
          type="text"
          id="identityNumber"
          value={identityNumber}
          onChange={(e) => setIdentityNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="drugCombination" className="block text-gray-700 font-bold">
          What drug combination did you search for?
        </label>
        <input
          type="text"
          id="drugCombination"
          value={drugCombination}
          onChange={(e) => setDrugCombination(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="outputGiven" className="block text-gray-700 font-bold">
          What is the output given by us?
        </label>
        <input
          type="text"
          id="outputGiven"
          value={outputGiven}
          onChange={(e) => setOutputGiven(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="expectedOutput" className="block text-gray-700 font-bold">
          What do you think the output should be?
        </label>
        <input
          type="text"
          id="expectedOutput"
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-bold"
        />
      </div>
      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit Feedback
      </button>
    </form>
  );
}

export default Feedback;
