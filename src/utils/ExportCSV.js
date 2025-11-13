import { Typography } from '@mui/material';
import React from 'react';
import { CSVLink } from 'react-csv';

const ExportCSV = ({ data, FileName }) => {
    return (
        <CSVLink data={data} filename={`${FileName}.csv`} >
            <Typography variant="subtitle2" style={{ textDecoration: 'none !important' ,color:'black'}}>Export</Typography>
        </CSVLink>
    );
};

export default ExportCSV;
