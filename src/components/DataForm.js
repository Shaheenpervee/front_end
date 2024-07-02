// src/components/DataForm.tsx
import React, { useState, useEffect } from 'react';

interface DataFormProps {
    initialData?: any;
    onSave: (data: any) => void;
}

const DataForm: React.FC<DataFormProps> = ({ initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key, index) => (
                <div key={index}>
                    <label>{key}:</label>
                    <input name={key} value={formData[key]} onChange={handleChange} />
                </div>
            ))}
            <button type="submit">Save</button>
        </form>
    );
};

export default DataForm;
