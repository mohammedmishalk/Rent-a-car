// import React from 'react';
// import { Card, Typography } from 'antd';
// import { Button } from '@material-ui/core';

// import DefaultLayout from '../../component/DefaultLayout';

// const { Title, Text } = Typography;

// function Profile() {
//   const user = localStorage.getItem('user');
//   const email = localStorage.getItem('email');
//   const balance = localStorage.getItem('wallet');

//   return (
//     <DefaultLayout>
//       <Card className="profile-card">
//         <Title level={3}>{user}</Title>
//         <Text className="profile-email">Email: {email}</Text>
//       </Card>
//       <Card className="wallet-card">
//         <Title level={4}>Wallet Balance</Title>
//         <Text>Rs{balance}</Text>
//       </Card>
//       <div className="button-group">
//         <Button className="order-button" type="primary">View Orders</Button>
//         <Button className="edit-button" type="primary" danger>Edit Profile</Button>
//       </div>
//     </DefaultLayout>
//   );
  
// }

// export default Profile;

import { Link } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';
import DefaultLayout from '../../component/DefaultLayout';
const { Title, Text } = Typography;

function Profile() {
  const user = localStorage.getItem('user');
   const email = localStorage.getItem('email');
   const balance = localStorage.getItem('wallet');
  return (
    <DefaultLayout>
      <Card className="profile-card" style={{ width: 400, marginTop: 50 }}>
        <Title level={3}>{user}</Title>
        <Text className="profile-email">Email: {email}</Text>  <br/>
        <Text className="profile-balance">Wallet balance: {balance}</Text>
        <Card style={{ marginTop: 20 }}>
          <Button  style={{ marginRight: 10 }}><Link to="/bookhistory">View Orders</Link></Button>
          <Button>Edit Profile</Button>
        </Card>
      </Card>
    </DefaultLayout>
  );
}

export default Profile;

