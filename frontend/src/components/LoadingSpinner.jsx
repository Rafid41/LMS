import React from 'react';
import { ClockLoader } from 'react-spinners';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ClockLoader color="#8f0eb0" size={100} />
    </div>
  );
};

export default LoadingSpinner;