import React from 'react';
import MainComponent from './MainComponent';
import { CharacterProvider } from './CharacterContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page: React.FC = () => {
  return (
    <div>
      <CharacterProvider>
        <MainComponent />
        <ToastContainer />
      </CharacterProvider>
    </div>
  );
}

export default Page;
