import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { checkAuth } from 'features/user';

import HomePage from 'containers/HomePage';
import DashboardPage from 'containers/DashboardPage';
import LoginPage from 'containers/LoginPage';
import RegisterPage from 'containers/RegisterPage';
import StorePage from 'containers/StorePage';
import CartPage from 'containers/CartPage';
import CheckoutPage from 'containers/CheckoutPage';
import OrderSuccessPage from 'containers/OrderSuccessPage';

import RouteWrapper from 'features/RouteWrapper';

import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

  const dispatch = useDispatch();

  // just when this component mounts, run our checkAuth function.
  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  return (

    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/dashboard' element={<DashboardPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route
          path="/store"
          element={
            <RouteWrapper>
              <StorePage />
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
    </Router>

  )
  };

export default App;