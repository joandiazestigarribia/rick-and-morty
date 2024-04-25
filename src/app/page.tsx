import React from 'react';
import MainComponent from './MainComponent';
import { CharacterProvider } from './CharacterContext';

const Page: React.FC = () => {
  return (
    <div>
      <CharacterProvider>
        <MainComponent />
      </CharacterProvider>
    </div>
  );
}

export default Page;
