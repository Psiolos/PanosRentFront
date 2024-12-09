import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import "../src/dist/styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import './App.css';

import Footer from "./components/Footer/Footer";
import Models from "./components/Model";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import AvailableCars from './components/General/AvailableCars';
import Contact from "./components/Contact/Contact";
import CarBox from "./components/CarBox";
import AddCar from "./components/Admin/AddCar";
import CarList from './components/Admin/CarList';
import Booking from './components/Booking/Booking';
import UserDash from './components/UserDash/UserDash';
import Admin from './components/Admin/Admin';
import CarReservations from "./components/CarReservations";
import ReservationList from './components/Admin/ReservationList';
{/* import ClientList from './components/ClientsList'; */}
import CarSearch from './components/Admin/CarSearch';
import DiscountBar from './components/DiscountBanner/DiscountBar';
import PageNotFound from './components/PageNotFound/PageNotFound';
import ClientList from './components/Admin/ClientList';
import ClientSearch from './components/Admin/ClientSearch';
import UserInfo from './components/UserDash/UserInfo';
import Income from './components/Admin/Income';
import MemberRent from './components/UserDash/MemberRent';
import MemberReservation from './components/UserDash/MemberReservation';
import UserRents from './components/UserDash/UserRents';

function App() {
  const location = useLocation(); 
  const [shouldShowNav, setShouldShowNav] = useState(true);

  const hidePaths = ['/login', '/register'];

  useEffect(() => {
    
      //elegxow kai allagi gia navbar klp stologinregister
    setShouldShowNav(!hidePaths.includes(location.pathname));
  }, [location.pathname]);

  return (
    <>
      {shouldShowNav && <Navbar />}
      {shouldShowNav && <DiscountBar />}
      <div style={{ paddingTop: '40px' }}></div>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/not-found" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="models" element={<Models />} />
        <Route path="contact" element={<Contact />} />
        <Route path="leasing" element={<AvailableCars />} />
        <Route path="/carlist" element={<CarList />} />
        <Route path="addcar" element={<AddCar />} />
        <Route path="/cars" element={<CarBox />} />
        <Route path="/pages/Booking" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/userdash" element={<UserDash />} />
        <Route path="/car/:carId/reservations" element={<CarReservations />} />
        <Route path="/showrentals" element={<ReservationList />} />
        <Route path="/customers" element={<ClientList />} />
        <Route path="/searchrentbycar" element={<CarSearch />} />
        <Route path="/searchbycustom" element={<ClientSearch />} />
        <Route path="/income" element={<Income />} />
        <Route path="/accdetails" element={<UserInfo />} />
        <Route path="/memberrent" element={<MemberRent />} />
        <Route path="/memberreservation/:id" element={<MemberReservation />} />
        <Route path="/userrents" element={<UserRents />} />

      </Routes>
      {shouldShowNav && <Footer />}
    </>
  );
}

export default App;
