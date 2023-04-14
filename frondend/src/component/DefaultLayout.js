import { useState,useEffect } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
 import axios from "../api/axios";
 import { config } from "../Helpers/axiosUserEndpoins";

function Wallet() {
  const [balance, setBalance] = useState(0);
  // const balance = localStorage.getItem('wallet');
  const uid = localStorage.getItem('uid');

  // retrieve balance from backend API on component mount
useEffect(() => {
  axios.get('/user/walletbalance', {
    params: {
      uid: uid
    },
    ...config
  })
  .then(response => {
    setBalance(response.data.wallet);
    localStorage.setItem("wallet", response.data.wallet);
  })
  .catch(error => console.error(error));
}, [uid]);


  return (
    <div className="wallet">
      <Space>
        <FontAwesomeIcon icon={faWallet} />
        <span>Rs.{balance}</span>
      </Space>
    </div>
  );
}

function DefaultLayout(props) {
  const user = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; // redirect to login page after logout
  };

  const items = [
    {
      key: '1',
      label: (
        <a href="/bookhistory">Booking</a>
      ),
    },
    {
      key: '2',
      label: (
        <a href="/profile">Profile</a>
      ),
    },
    {
      key: '3',
      label: (
        <a onClick={handleLogout}>Logout</a>
      ),
    },
  ];

  return (
    <div>
      <div className="header bs1">
        <div className="d-flex justify-content-between">
        <Link to="/" className="rent-car-button">
          <h1>CarsRent</h1>
          </Link>
          <div className="d-flex align-items-center">
            <Wallet />
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomLeft"
            >
              <Button>{user}</Button>
            </Dropdown>
          </div>
        </div>
        <div>{user ? `Welcome, ${user}` : null}</div>
      </div>
      <div className="content">{props.children}</div>
    </div>
  );
}

export default DefaultLayout;
