// src/components/DataTable.tsx
import React from 'react';

interface DataTableProps {
    data: any[];
    columns: { title: string, field: string }[];
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, onEdit, onDelete }) => {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, index) => <th key={index}>{col.title}</th>)}
                    {(onEdit || onDelete) && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                    <tr key={idx}>
                        {columns.map((col, index) => <td key={index}>{item[col.field]}</td>)}
                        {(onEdit || onDelete) && (
                            <td>
                                {onEdit && <button onClick={() => onEdit(item)}>Edit</button>}
                                {onDelete && <button onClick={() => onDelete(item)}>Delete</button>}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
