import React, { useState } from 'react';

interface RentFormProps {
    onSearch: (startDate: string, endDate: string) => void;
}

const RentForm: React.FC<RentFormProps> = ({ onSearch }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (startDate && endDate) {
            console.log("Submitting dates:", startDate, endDate); 
            onSearch(startDate, endDate);
        } else {
            console.log("Start date or end date is missing."); 
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Start Date:
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </label>
            <label>
                End Date:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Search Available Cars</button>
        </form>
    );
};

// Default export
export default RentForm;
