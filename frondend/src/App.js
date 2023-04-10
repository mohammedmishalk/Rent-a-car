// import React from 'react'
// import { BrowserRouter as Router, Routes, Route ,Navigate } from 'react-router-dom';


// import Login from "./pages/User/Login"
// import Sigup from "./pages/User/Signup"
// import Home from './pages/Home';
// // import ProtectedRoute from './component/ProtectedRoute';
// import OTP from "./pages/User/OTP"
 

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Sigup />} />
//         <Route path="/OTP" element={<OTP />} />
//         <Route
//           path="/"
//           element={<ProtectedRoute element={<Home />} />}
//         />
//       </Routes>
//     </Router>
//   );
// }
// export default App



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/User/Login';
import Sigup from './pages/User/Signup';
import Home from './pages/Home';
import OTP from './pages/User/OTP';
import Booking from './pages/User/Booking';
import Profile from './pages/User/Profile';
import BookingHistory from './pages/User/BookingHistory';
import Payment from './pages/User/Payment';
import PaymentSuccess from './pages/User/PaymentSuccess';
import AdminRouter from './Route/AdminRouter';
import LoginAdmin from "./pages/Admin/LoginAdmin"
function App() {
  const user=localStorage.getItem("user");
  return (
    <Router>
      <Routes>

        //user route
        <Route path="/admin/login" element={ <LoginAdmin /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/signup" element={<Sigup />} />
        <Route path="/OTP" element={<OTP />} />
        <Route path="/booking/" element={<Booking />} />
        <Route path="/bookhistory" element={<BookingHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/" element={user ? <Home/> : <Navigate to="/login"/> } />


          //radmin route
        
          <Route path="/admin/*" element={<AdminRouter />} />

      </Routes>
    </Router>
  );
}

export default App;

