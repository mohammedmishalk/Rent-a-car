import React, { useState } from "react";
import axios from "../../../api/axios";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const AddCar = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [rentPerDay, setRentPerDay] = useState(0);
    const [fuelType, setFuelType] = useState('');
    const [capacity, setCapacity] = useState(0);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/teacher/categories")
//       .then((response) => {
//         setCategories(response.data.categories);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const handleCourseNameChange = (event) => {
//     setCourseName(event.target.value);
//   };

//   const handleDescriptionChange = (event) => {
//     setDescription(event.target.value);
//   };

//   const handleCategoryChange = (event) => {
//     setCategory(event.target.value);
//   };

//   const handleLinkChange = (event) => {
//     setLink(event.target.value);
//   };

//   const handlePriceChange = (event) => {
//     setPrice(event.target.value);
//   };

//   const handleImageChange = (event) => {
//     setImage(event.target.files[0]);
//   };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
      formData.append('image', image);
      formData.append('rentPerDay', rentPerDay);
      formData.append('fuelType', fuelType);
      formData.append('capacity', capacity);
      console.log(formData)

    axios
      .post("/admin/addcar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
         window.location="/admin/cardata"
        // Reset the form state
        setName('');
      setImage(null);
      setRentPerDay(0);
      setFuelType('');
      setCapacity(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "50%",
        margin: "auto",
        gap: "20px",
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Car Name"
        variant="outlined"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <TextField
        label="Rent/day"
        variant="outlined"
        value={rentPerDay}
        onChange={(event) => setRentPerDay(event.target.value)}
      />

      {/* <FormControl variant="outlined" >
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={category}
          onChange={handleCategoryChange}
          label="Category"
        >
          {categories && categories.map((category) => (
            <MenuItem key={category._id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select a category for the course</FormHelperText>
      </FormControl> */}

      <TextField
        label="fuelType"
        variant="outlined"
        value={fuelType}
        onChange={(event) => setFuelType(event.target.value)}
      />
      <TextField
  label="capacity"
  variant="outlined"
  value={capacity}
  onChange={(event) => setCapacity(event.target.value)}
/>


      <FormControl sx={{ mt: 1, mb: 1 }}>
        <input
          accept="image/*"
          id="image-upload"
          multiple
          type="file"
          onChange={(event) => setImage(event.target.files[0])}
        />
        <label htmlFor="image-upload">
          <Button variant="outlined" component="span">
            Upload Image
          </Button>
        </label>
      </FormControl>

      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  );
};

export default AddCar;