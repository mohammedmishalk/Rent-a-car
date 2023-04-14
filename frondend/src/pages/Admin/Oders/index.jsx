
import React, { useEffect, useState } from 'react';
import axios from "../../../api/axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// import {config} from "../../../Helpers/axiosAdminEndpoints"

//  console.log(config)



 function BasicTable() {
  const config = {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  };
  

  const [oder, setoders] = useState([]);
  const [error, setError] = useState(null);
       
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/admin/Booking",config);
        setoders(response.data.found);
      } catch (error) {
        console.log(error);
        setError("Error fetching data from server.");
      }
    }
  
    fetchData();
  }, []);


  const handleRefund=async(id)=>{
    try {


      
      const response = await axios.put(`/admin/Refunde/${id}`,null, config);
      console.log(response)
    window.location="/admin/oders"
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleRutren=async(id)=>{
    try {
      const response = await axios.put(`/admin/deliver/${id}`,null, config);
      console.log(response)
    window.location="/admin/oders"
    } catch (error) {
      console.log(error);
    }
  }
  const handleDrilver=async(id)=>{
    try {
      const response = await axios.put(`/admin/dropped/${id}`,null, config);
      console.log(response)
    window.location="/admin/oders"
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={{ height: 400, overflow: 'auto' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>order id</TableCell>
              <TableCell align="right">cars name</TableCell>
              <TableCell align="right">from</TableCell>
              <TableCell align="right">to</TableCell>
              <TableCell align="right">total Amount</TableCell>
              <TableCell align="right">Cancel</TableCell>
              <TableCell align="right">drop Status</TableCell>
              <TableCell align="right">oder status</TableCell>
              {/* <TableCell align="right">Action</TableCell> */}
              <TableCell align="right">Action</TableCell>
              {/* <TableCell align="right">dsf</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {oder.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.order_id}
                </TableCell>
                <TableCell align="right">{row.cars}</TableCell>
                <TableCell align="right">{row.from}</TableCell>
                <TableCell align="right">{row.to}</TableCell>
                <TableCell align="right">{row.totalAmount}</TableCell>
                <TableCell align="right">{row.cancel}</TableCell>
                <TableCell align="right">{row.dropped}</TableCell>
                <TableCell align="right">{row.orderStatus}</TableCell>
                {/* <TableCell align="right">{row.protein}</TableCell> */}
                <TableCell align="right">
  {row.cancel === "true" ? 
    <button onClick={() => handleRefund(row._id)} style={{backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '4px'}}>Refund</button> 
    : null
  }
  {row.dropped === 'Pending' && row.dropped !== 'true' && row.orderStatus !== 'Returned' && row.cancel !== "Refuned" ? 
    <button onClick={() => handleDrilver(row._id)} style={{backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '4px'}}>Delivered</button> 
    : null
  }
  {row.orderStatus === 'Pending' && row.cancel !== "Refuned" ? 
    <button onClick={() => handleRutren(row._id)} style={{backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '4px'}}>Returned</button> 
    : null
  }
</TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BasicTable;