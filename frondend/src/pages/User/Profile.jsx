import React from 'react';
import { Card, Typography } from 'antd';
import DefaultLayout from '../../component/DefaultLayout';

const { Title, Text } = Typography;

function Profile() {
  const user = localStorage.getItem('user');
  const email = localStorage.getItem('email');

  return (
    <DefaultLayout>
      <Card className="profile-card">
        <Title level={3}>{user}</Title>
        <Text className="profile-email">Email: {email}</Text>
      </Card>
    </DefaultLayout>
  );
}

export default Profile;

{/* <style>

</style> */}
