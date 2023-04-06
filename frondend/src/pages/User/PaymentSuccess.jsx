import React from 'react';
import { Result, Button } from 'antd';
import DefaultLayout from "../../component/DefaultLayout"

function PaymentSuccess() {
  return (
    <DefaultLayout>
      <Result
        status="success"
        title="Payment Successful"
        subTitle="Thank you for your payment."
        extra={[
          <Button type="primary" key="home" href="/">
            Go to Home
          </Button>,
          <Button key="booking" href="/bookhistory">
            View Booking Details
          </Button>,
        ]}
      />
    </DefaultLayout>
  );
}

export default PaymentSuccess;
