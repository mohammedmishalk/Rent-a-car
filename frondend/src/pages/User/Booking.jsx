import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DefaultLayout from "../../component/DefaultLayout";
import { Row, Col, Divider, DatePicker, Checkbox } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { config } from "../../Helpers/axiosUserEndpoins";

function Booking() {
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const uid = localStorage.getItem("uid");
  console.log(user);
  const location = useLocation();
  const selectedCar = location.state.selectedCar;
  const car = selectedCar.cars;
  const carName = car.name;
  console.log(carName);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [bookingStatus, setBookingStatus] = useState("available");
  const [showDatePicker, setShowDatePicker] = useState(true);

  const [totalDays, setTotalDays] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [allCarBookings, setAllCarBookings] = useState([]);
  const [toDates, setToDates] = useState([]);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  function selectTimeSolt(values) {
    console.log(values);
    setFrom(moment(values[0].$d).format("MMM DD yyyy HH:mm"));
    setTo(moment(values[1].$d).format("MMM DD yyyy HH:mm"));
    setTotalDays(values[1].diff(values[0], "days"));
  }

  useEffect(() => {
    setTotalAmount(totalDays * car.rentPerDay + driver && totalDays * 30);
    if (driver) {
      setTotalAmount(totalAmount + 30 * totalDays);
    }
  }, [driver, totalDays]);

  useEffect(() => {
    // replace with your backend API endpoint for retrieving booking history
    axios
      .get("/user/history", {
        params: {
          user_id: uid,
          carName: carName,
        },
        ...config
      })
      .then((response) => {
        // console.log(object)
        if (response.data.success) {
          // console.log("bhhhhhh")
          // setIsSubmitting(true);
          // setBookingStatus("booked");
          // setShowDatePicker(false);
          console.log(response.data.allCarBookings);
          setAllCarBookings(response.data.allCarBookings);
          const allCarBookings = response.data.allCarBookings;
          const toDates = allCarBookings.map((booking) => booking.to);
          setToDates(toDates);
        }
      });
  }, []);

  function bookNow() {
    const data = {
      user: user,
      carName: car.name,
      from: from,
      to: to,
      driverRequired: driver,
      totalDays: totalDays,
      totalAmount: totalAmount,
    };
    navigate("/payment", { state: data });
  }

  return (
    <DefaultLayout>
      <Row
        justify="center"
        className="d-flex align-items-center "
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24}>
          <img src={car.image[0].url} alt="" className="carimg2 bs1" />
        </Col>

        <Col lg={10} sm={24} xs={24} className="text-right">
          <Divider type="horizontal" dashed>
            Car info
          </Divider>
          <div style={{ textAlign: "right" }}>
            <p>{car.name}</p>
            <p>{car.rentPerday} Rent Per day /-</p>
            <p>Fuel type:{car.fuelType}</p>
            <p>Max persons:{car.capacity}</p>
          </div>

          {bookingStatus === "booked" && !showDatePicker && (
            <>
              <p>Booking made on {moment().format("MMM DD YYYY HH:mm")}</p>
              {/* <p>Total Amount:{totalAmount}</p> */}
            </>
          )}

          {bookingStatus === "booked" && showDatePicker && (
            <>
              <Divider type="horizontal" dashed>
                select the slot
              </Divider>
              <DatePicker.RangePicker
                showTime={{ format: "HH:mm" }}
                format="MM DD YYYY HH:mm"
                onChange={selectTimeSolt}
              />
              <div>
                <p>
                  Total Days :<b>{totalDays}</b>
                </p>
                <p>
                  {" "}
                  Rent Per Day :<b> {car.rentPerday}</b>
                </p>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setdriver(true);
                    } else {
                      setdriver(false);
                    }
                  }}
                />{" "}
                Driver Required
                <Checkbox />
                <h1>Total Amount:{totalAmount}</h1>
                <button className="btn1" onClick={bookNow}>
                  BOOK NOW
                </button>
              </div>
            </>
          )}

          {bookingStatus === "available" && (
            <>
              <p>This car is available for booking</p>
              <Divider type="horizontal" dashed>
                select the slot
              </Divider>
              <DatePicker.RangePicker
                showTime={{ format: "HH:mm" }}
                format="MM DD YYYY HH:mm"
                disabledDate={(current) =>
                  toDates.some((date) => current && current <= moment(date))
                }
                onChange={selectTimeSolt}
              />

              <div>
                <p>
                  Total Days :<b>{totalDays}</b>
                </p>
                <p>
                  {" "}
                  Rent Per Day :<b> {car.rentPerday}</b>
                </p>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setdriver(true);
                    } else {
                      setdriver(false);
                    }
                  }}
                />{" "}
                Driver Required
                <Checkbox />
                <h1>Total Amount:{totalAmount}</h1>
                <button className="btn1" onClick={bookNow}>
                  BOOK NOW
                </button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default Booking;
