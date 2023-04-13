import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import axios from "../../../api/axios";
import swal from 'sweetalert';

function Cars() {
  // const config = {
  //   headers: {
  //     Authorization: `${localStorage.getItem("token")}`,
  //   },
  // };

  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/admin/getallcars");
        setCars(response.data);
      } catch (error) {
        console.log(error);
        setError("Error fetching data from server.");
      }
    }
  
    fetchData();
  }, []);

  const handleBlock =  (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to Disable car ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("The car is disabled!", {
          icon: "success",
        });
        block(id);
      } else {
        swal("The car not disable");
      }
    });
  };

  const block=async(id)=>{
    try {


      
      const response = await axios.get(`/admin/blockcars/${id}`);
      console.log(response)
    window.location="/admin/cardata"
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Car Name</TableCell>
            <TableCell>Rent/day</TableCell>
            <TableCell>Seats</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Fuel type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cars &&
            cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>{car.name}</TableCell>
                <TableCell>{car.rentPerday}</TableCell>
                <TableCell>{car.capacity}</TableCell>
                
                <TableCell className="car-image-cell">
  <img src={car.image[0].url} alt={car.brand} style={{ maxWidth: "100%", maxHeight: "100%" }} />
</TableCell>

<TableCell>{car.fuelType}</TableCell>
                <TableCell>
                 
                <Button
  variant="contained"
  color={car.status==false? "primary" : "secondary"}
  onClick={() => handleBlock(car._id)}
>
{car.status===false? "Disable" : "Enable"}
</Button>

                  
                 
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Link to="/admin/addcars">
      <Button variant="contained" color="primary" >
  Add Car
</Button>
</Link>
    </TableContainer>
    
  );
}

export default Cars;
