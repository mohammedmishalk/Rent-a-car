import { Box,  useTheme } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { tokens } from "../theme";
import { useState, useEffect } from 'react';
import axios from "axios"
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Header from "../Header/Header";

 import StatBox from "../Statebox/StatBox";


const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [data, setdata] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
console.log(data)
  useEffect(() => {
    async function fetchData() {
      try {

        const response = await axios.get("http://localhost:5000/admin/home");
       
        setdata(response.data);
        setChartData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [setdata]);




// useEffect(() => {
//   async function fetchData() {
//     try {
//       const response = await axios.get("http://localhost:5000/admin/chart");
//       setChartData(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   fetchData();
// }, []);


  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.productcount}
            subtitle="Total cars"
            // progress="0.75"
            // increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.totalIncome}
            subtitle="Total income"
            // progress="0.50"
            // increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
             }
          /> 
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.usercount}
            subtitle="Total users"
            // progress="0.30"
            // increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 6">
  <LineChart
    width={500}
    height={300}
    data={chartData}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis dataKey="name" />
    <YAxis />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
  </LineChart>
</Box>


     </Box>
    </Box>
  );
  }


export default Dashboard;
