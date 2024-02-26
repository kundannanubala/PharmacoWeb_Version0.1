import React from 'react';
import TabletCard from './TabletCard';
import './tableCard.css'
const SubmittedDrugsDisplay = ({ submittedDrugs }) => {
    return (
        <div>
            
            {submittedDrugs.length > 0 && (
                <>
                <h2>Submitted Drugs Details:</h2>
                <div className="tablets-container">
                    {submittedDrugs.map((tablet, index) => (
                        <TabletCard key={tablet._id || index} tablet={tablet} />
                    ))}
                </div>
                </>
            )}
        </div>
    );
};

export default SubmittedDrugsDisplay;