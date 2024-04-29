import React from 'react';
import MainComponent from './MainComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page: React.FC = () => {
  return (
    <div>
        <MainComponent />
        <ToastContainer />
    </div>
  );
}

export default Page;
