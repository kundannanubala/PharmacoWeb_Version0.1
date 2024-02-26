import React, { useState } from 'react';
import './tableCard.css';

const TabletCard = ({ tablet }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`tablet-card ${isExpanded ? 'expanded' : ''}`} style={isExpanded ? { gridColumn: 'span 3' } : {}} >
            <button onClick={toggleExpand}>Click For more Information</button>
            <h3>{tablet.Medicine_Name}</h3>
            <p><strong>MRP:</strong> {tablet.MRP}</p>
            <p><strong>Uses:</strong> {tablet.Uses}</p>
            <p><strong>Side Effects:</strong> {tablet.Side_Effects}</p>
            <p><strong>How to Use:</strong> {tablet.How_to_Use}</p>
            <p className="composition"><strong>Composition:</strong> {tablet.Composition}</p>
            {isExpanded && (
                <div className="expanded-info">
                    <p><strong>Manufacturer:</strong> {tablet.Manufacturer}</p>
                    <p><strong>Prescription:</strong> {tablet.Prescription}</p>
                    <p><strong>Alternate Medicines:</strong> {tablet.Alternate_Medicines}</p>
                    <p><strong>Therapeutic Class:</strong> {tablet.Therapeutic_Class}</p>
                </div>
            )}
        </div>
    );
};

export default TabletCard;
