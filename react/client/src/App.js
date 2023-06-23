import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { checkAuth } from 'features/user';

import HomePage from 'containers/HomePage';
import DashboardPage from 'containers/DashboardPage';
import LoginPage from 'containers/LoginPage';
import RegisterPage from 'containers/RegisterPage';
import MerchPage from 'containers/MerchPage';
import CartPage from 'containers/CartPage';
import CheckoutPage from 'containers/CheckoutPage';
import OrderSuccessPage from 'containers/OrderSuccessPage';
import PrivacyPage from 'containers/PrivacyPage';
import AboutPage from 'containers/AboutPage';

import BackgroundContainer from 'components/layouts/BackgroundContainer';

import RouteWrapper from 'features/RouteWrapper';

import 'bootstrap/dist/css/bootstrap.min.css';
import './components/css/Dashboard.css';


const App = () => {

  const dispatch = useDispatch();

  // just when this component mounts, run our checkAuth function.
  useEffect(() => {
    dispatch(checkAuth());
  });

  return (

    <Router>
      <BackgroundContainer>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/dashboard' element={<DashboardPage/>} />
        <Route path='/privacy' element={<PrivacyPage/>} />
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route
          path="/merch"
          element={
            <RouteWrapper>
              <MerchPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <RouteWrapper>
              <CartPage />
            </RouteWrapper>
          }
        />
        <Route path='/checkout' element={<CheckoutPage/>} />
        <Route path='/cart/success' element={<OrderSuccessPage/>} />
      </Routes>
      </BackgroundContainer>
    </Router>

  )
  };

export default App;