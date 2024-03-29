import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Row, Col, Pagination } from 'antd';
import axios from "../../src/api/axios";
import DefaultLayout from "../component/DefaultLayout"
import { getAllCars } from '../redux/actions/carsActions';
import Spinner from '../component/Spinner';
import { config } from "../Helpers/axiosUserEndpoins";

function Home() {


  // useEffect(() => {
  //   axios.get('http://localhost:5000/teacher/courses')
  //     .then(response => {
  //       setCourses(response.data.course);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, []);


  const navigate = useNavigate();

  const { cars } = useSelector(state => state.carsReducer);
  const { loading } = useSelector(state => state.alertsReducer);
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Change the number of cars displayed per page here
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars())
  }, [])

  const carDetails = async (id) => {
    try {
      const response = await axios.get(`/user/product/${id}`,config);
      setSelectedCar(response.data);
      navigate('/booking', { state: { selectedCar: response.data } });
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  }
  const handleDateChange = (dates) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  }

  const filterByDateRange = (car) => {
    if (!startDate || !endDate) {
      // No dates selected, return all cars
      return true;
    }
    // Check if the car is available during the selected date range
    for (let date of car.availability) {
      if (new Date(date.startDate) <= startDate && new Date(date.endDate) >= endDate) {
        return true;
      }
    }
    return false;
  }

  const indexOfLastCar = currentPage * pageSize;
  const indexOfFirstCar = indexOfLastCar - pageSize;
  // const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const filteredCars = cars.filter(car => car.name.toLowerCase().includes(searchTerm.toLowerCase()) && filterByDateRange(car));

  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <DefaultLayout >
      {loading === true && (<Spinner />)}
      <nav className="navbar">
        <input type="text" placeholder="Search by car name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <DatePicker.RangePicker value={[startDate, endDate]} onChange={handleDateChange} disabledDate={(current) => current && current < moment().startOf('day')} />
      </nav>
      <Row justify='center' gutter={16} className="mt-5">
      {/* <input type="text" placeholder="Search by car name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /> */}

        {currentCars.map(car => {
          return <Col lg={5} sm={24} xs={24}>
            <div className='car p-2 bs1'>
              <img src={car.image[0].url} className="caring" />
              <div className='car-content d-flex align-items-center justify-content-between'>
                <div>
                  <p>{car.name}</p>
                  <p>{car.rentPerday} Rent Per day </p>
                </div>
                <div>
                  <button className='btn1 mr-2' onClick={() => carDetails(car._id)}> Book Now</button>
                </div>
              </div>
            </div>
          </Col>
        })}
      </Row>
      <div className="pagination-container d-flex justify-content-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={cars.length}
          onChange={handlePageChange}
        />
      </div>
    </DefaultLayout>
  )
}

export default Home;
