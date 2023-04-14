import React, { useEffect, useState } from 'react';
import axios from "../../../api/axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Button } from 'antd';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { pdf, Document, Page } from '@react-pdf/renderer';
import {config} from "../../../Helpers/axiosAdminEndpoints"
import MyDocument from '../../../component/MyDocument';

function BasicTable() {
  const [oder, setoders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/admin/salesReport",config);
        setoders(response.data.month);
      } catch (error) {
        console.log(error);
        setError("Error fetching data from server.");
      }
    }

    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    const pdfDoc = (
      <MyDocument data={oder} />
    );
    const asPdf = pdf([]); // Use [] to save as PDF in client side
    asPdf.updateContainer(pdfDoc);
    asPdf.toBlob().then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "monthly_report.pdf";
      a.click();
    });
  };

  return (
    <div style={{ height: 400, overflow: 'auto' }}>
      <Typography style={{ textAlign: 'center', color: 'white' , fontSize: '1.5rem' }}>
        Monthly Report
      </Typography>
      {/* <Button onClick={handleDownloadPDF}>Download PDF</Button> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Order Id</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Order Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {oder.map((row) => (
              <TableRow key={row.order_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="right">{row.order_id}</TableCell>
                <TableCell align="right">{row.totalAmount}</TableCell>
                <TableCell align="right">{row.dropped}</TableCell>
                <TableCell align="right">{row.orderStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ textAlign: 'center' }}>
  <Button style={{ color: 'white' }} onClick={handleDownloadPDF}>
    Download PDF
  </Button>
</div>
    </div>
  );
}

export default BasicTable;

