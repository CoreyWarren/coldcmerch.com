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

import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

  const dispatch = useDispatch();

  // just when this component mounts, run our checkAuth function.
  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  return (
    <StripeProvider
      publishableKey="pk_test_51LjuaCGd7lKiUeBGRFkJwuDYfZYaaorVbFrymMwSPPx5OGsEOfJ1iSOdQjtENj301eYE12TF1BSiOADGLgQicDsG00emnhRMQk"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >

    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/dashboard' element={<DashboardPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/store' element={<StorePage/>} />
        <Route path='/cart' element={<CartPage/>} />
      </Routes>
    </Router>

    </StripeProvider>
  )
  };

export default App;