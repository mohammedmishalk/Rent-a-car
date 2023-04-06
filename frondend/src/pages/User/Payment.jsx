import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Divider, Button, Radio } from "antd";
import DefaultLayout from "../../component/DefaultLayout";
import axios from "axios";
import useRazorpay from "react-razorpay";

function Payment() {
  const navigate = useNavigate();
  const Razorpay = useRazorpay();
  const [PaymentMethod, setSelectedPaymentMethod] = useState("");
  const location = useLocation();
  const totalAmount = location.state.totalAmount;
  const uid = localStorage.getItem("uid");
  function handleWalletPayment() {
    setSelectedPaymentMethod("wallet");
  }

  function handleOnlinePayment() {
    setSelectedPaymentMethod("online");
  }

  function handlePayment() {
    if (PaymentMethod) {
      axios
        .post("http://localhost:5000/user/orderConfirmed", {
          uid: uid,
          carName: location.state.carName,
          paymethod: PaymentMethod,
          totalAmount: totalAmount,
          from: location.state.from,
          to: location.state.to,
          driverRequired: location.state.driverRequired,
          totalDays: location.state.totalDays,
        })
        .then((response) => {
          console.log(response.data[0].orders);
          const order = response.data[0].orders;
          var options = {
            key: "rzp_test_XUbZpvWoTVZ2ie", // Enter the Key ID generated from the Dashboard
            amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "rent car", //your business name
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: function (response) {
              verifyPayment(response, order);
            },
            prefill: {
              name: "rentacar",
              email: "misahlnunu@gmail.com",
              contact: "9999999999",
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#235784",
            },
          };
          var rzp1 = new Razorpay(options);
          rzp1.on("payment.failed", function (response) {
            //redirect to payment failed page
          });
          rzp1.open();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function verifyPayment(response, order) {
    axios
      .post("http://localhost:5000/user/verifyPayment", {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        order,
        userId: uid,
      })
      .then((response) => {
        if (response.data.success) {
          navigate("/success");
        } else {
          console.log("payment failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // navigate('/success');

  // function razorPay(order) {
  //   var options = {
  //     key: "rzp_test_XUbZpvWoTVZ2ie", // Enter the Key ID generated from the Dashboard
  //     amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //     currency: "INR",
  //     name: "e-commerce",
  //     description: "Test Transaction",
  //     order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //     handler: function (response) {
  //       console.log(response);
  //       verifyPayment(response, order);
  //     },
  //     prefill: {
  //       name: "	mohammed misahl k",
  //       email: "mishalnunu@gmail.com",
  //       contact: "8089000000",
  //     },
  //     notes: {
  //       address: "Razorpay Corporate Office",
  //     },
  //     theme: {
  //       color: "#F05196",
  //     },
  //   };
  //   var rzp1 = new Razorpay(options);
  //   console.log('options are  jksdfskjdsdfjsl', options);
  //   rzp1.on("payment.failed", function (response) {
  //   });
  //   rzp1.open();
  // }

  // function verifyPayment(payment, order) {
  //   console.log('order is', order);
  //   $.ajax({
  //     url: "/user/verifyPayment",
  //     data: {
  //       payment,
  //       order,
  //     },
  //     method: "post",
  //     success: (response) => {
  //       if (response.success) {
  //         location.href = '/user/orderSuccess';
  //         // location.href = '/user/orderSuccess';
  //         console.log('payment success');
  //       } else {
  //         location.href = "/user/paymentFail";
  //         console.log('payment failed');
  //       }
  //     },
  //   });
  // }

  return (
    <DefaultLayout>
      <Row
        justify="center"
        className="d-flex align-items-center "
        style={{ minHeight: "90vh" }}
      >
        <Col lg={12} sm={24} xs={24} className="text-center">
          <h1>Payment Details</h1>
          <Divider />
          <h3>Total Amount: {totalAmount}/-</h3>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Select Payment Method:</h4>
          </div>
          <Row justify="center">
            <Col lg={10} md={10} sm={24} xs={24}>
              <div className="payment-card" onClick={handleWalletPayment}>
                <Radio
                  checked={PaymentMethod === "wallet"}
                  onClick={handleWalletPayment}
                />
                <h4>Pay with Wallet</h4>
                <p>Your wallet balance: $.00</p>
              </div>
            </Col>
            <Col lg={10} md={10} sm={24} xs={24}>
              <div className="payment-card" onClick={handleOnlinePayment}>
                <Radio
                  checked={PaymentMethod === "online"}
                  onClick={handleOnlinePayment}
                />
                <h4>Pay Online</h4>
                <p>Enter your payment details</p>
              </div>
            </Col>
          </Row>
          {PaymentMethod && (
            <div>
              <p>Selected payment method: {PaymentMethod}</p>
              <Button
                type="primary"
                style={{ backgroundColor: "green" }}
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default Payment;
