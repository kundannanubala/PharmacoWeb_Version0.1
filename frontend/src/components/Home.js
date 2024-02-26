import React from 'react';
import '../index.css';
import Navbar from './Navbar';

const Homepage = () => {
  return (
    <div className='main-container'>
      <Navbar/>
      <div className="divider"></div>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Empowering Your Health Decisions</h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Our Prescription Checker tool goes beyond providing detailed information about your medications. It actively checks for potential drug-drug interactions (DDIs), ensuring your prescription safety and contributing to pharmacovigilance.</p>
          
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <button onClick={() => {window.location.href = '/MultiSearchTablets';}} className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
              Start Checking Prescriptions
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>

          <section className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Enhancing Pharmacovigilance</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Our innovative feature for checking potential drug-drug interactions (DDIs) is at the forefront of ensuring medication safety. By analyzing the interactions between the drugs/compositions in your prescriptions, we contribute to the field of pharmacovigilance, helping to prevent adverse effects and enhance therapeutic outcomes.</p>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Use Our Prescription Checker?</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Unlock the full potential of your medication management:</p>
            <ul className="list-disc list-inside text-lg text-gray-500 dark:text-gray-400">
              <li>Understand the purpose and benefits of your prescriptions.</li>
              <li>Learn about potential side effects and how to manage them.</li>
              <li>Discover alternatives and options for your treatment plan.</li>
              <li>Ensure safety with our DDI check, reducing the risk of adverse drug reactions.</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Enter the names of your medications to receive comprehensive details, including a thorough analysis of potential drug-drug interactions. Our tool equips you with the information you need to make informed health decisions confidently.</p>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
