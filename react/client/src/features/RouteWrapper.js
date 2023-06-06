// RouteWrapper.js
import { useEffect } from 'react';

const RouteWrapper = ({ children }) => {
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return children;
};

export default RouteWrapper;