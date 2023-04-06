import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import DefaultLayout from "../../component/DefaultLayout"

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const uid = localStorage.getItem('uid');
  console.log('bookings:', bookings);

  useEffect(() => {
    axios.get('http://localhost:5000/user/oderhistory',{
      params: {
        uid: uid
      }
    })
      .then(response => setBookings(response.data.booked))
      .catch(error => console.error(error));
  }, [uid]);

  const handleCancel = (bookingId) => {
    // Send a request to cancel the booking with the specified ID
    axios.put(`http://localhost:5000/user/cancel/${bookingId}`)
      .then(response => {
        // Update the state to remove the cancelled booking
        // const updatedBookings = bookings.filter(b => b.order_id !== bookingId);
        // setBookings(updatedBookings);
        // Show a success message to the user
        message.success('Booking cancelled successfully');
        window.location="/bookhistory"
      })
      .catch(error => {
        // Show an error message to the user
        message.error('Failed to cancel booking');
      });
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'order_id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Car Model',
      dataIndex: 'cars',
      key: 'carModel',
    },
    {
      title: 'Pickup Date',
      dataIndex: 'from',
      key: 'pickupDate',
      sorter: (a, b) => new Date(a.pickupDate) - new Date(b.pickupDate),
    },
    {
      title: 'Return Date',
      dataIndex: 'to',
      key: 'returnDate',
      sorter: (a, b) => new Date(a.returnDate) - new Date(b.returnDate),
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalAmount',
      key: 'totalCost',
      sorter: (a, b) => a.totalCost - b.totalCost,
      render: cost => `Rs${cost}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, booking) => {
        if (booking.cancel === "true") {
          return 'Cancelled';
        } else {
          return <Button onClick={() => handleCancel(booking.order_id)}>Cancel</Button>;
        }
      },
    },
    
  ];

  return (
    <DefaultLayout className="booking-history">
      <h1>Booking History</h1>
      <Table columns={columns} dataSource={bookings} />
    </DefaultLayout>
  );
}

export default BookingHistory;
