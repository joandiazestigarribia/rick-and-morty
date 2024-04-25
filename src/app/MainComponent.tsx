'use client'
import React, { useEffect, useState } from 'react';
import Paginator from './Paginator';
import { useCharacterContext } from './CharacterContext';

const MainComponent: React.FC = () => {
  const { selectedCharacter, setSelectedCharacter } = useCharacterContext();
  const [characters, setCharacters] = useState<any[]>([]);
  const [leftPage, setLeftPage] = useState<number>(1);
  const [rightPage, setRightPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedLeftCharacter, setSelectedLeftCharacter] = useState<any>(null);
  const [selectedRightCharacter, setSelectedRightCharacter] = useState<any>(null);
  const [showMoreLeftEpisodes, setShowMoreLeftEpisodes] = useState<boolean>(false);
  const [showMoreSharedEpisodes, setShowMoreSharedEpisodes] = useState<boolean>(false);
  const [showMoreRightEpisodes, setShowMoreRightEpisodes] = useState<boolean>(false);

  const pageSize = 4; // Number of characters per page
  const maxResults = 5; // Maximum number of episodes to display initially

  useEffect(() => {
    const fetchDataCharacter = async () => {
      try {
        let allCharacters: any[] = [];
        let nextPage = 1;

        // Fetch data from each page until all results are fetched
        while (nextPage <= totalPages) {
          const response = await fetch(`https://rickandmortyapi.com/api/character?page=${nextPage}`);
          if (response.ok) {
            const data = await response.json();
            allCharacters = [...allCharacters, ...data.results];
            nextPage++;
          } else {
            console.error('Error fetching data:', response.statusText);
            break;
          }
        }

        setCharacters(allCharacters);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchDataCharacter();
  }, [totalPages]);


  useEffect(() => {
    const fetchPageCount = async () => {
      try {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        if (response.ok) {
          const data = await response.json();
          setTotalPages(Math.ceil(data.info.count / pageSize));
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPageCount();
  }, []);

  useEffect(() => {
    const fetchDataEpisode = async () => {
      try {
        let allEpisodes: any[] = [];
        let nextPage = 1;

        // Fetch data from each page until all results are fetched
        while (nextPage <= totalPages) {
          const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${nextPage}`);
          if (response.ok) {
            const data = await response.json();
            allEpisodes = [...allEpisodes, ...data.results];
            nextPage++;
          } else {
            console.error('Error fetching data:', response.statusText);
            break;
          }
        }

        setEpisodes(allEpisodes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataEpisode();
  }, [totalPages]);


  const handleCharacterClick = (character: any) => {
    setSelectedCharacter(character);
  };

  const handleLeftCharacterClick = (character: any) => {
    if (selectedRightCharacter && selectedRightCharacter.id === character.id) {
      // Si el personaje seleccionado en la columna izquierda es el mismo que el seleccionado en la derecha, muestra una alerta
      alert('You cannot select the same character in both columns.');
    } else {
      setSelectedLeftCharacter(character);
    }
  };

  const handleRightCharacterClick = (character: any) => {
    if (selectedLeftCharacter && selectedLeftCharacter.id === character.id) {
      // Si el personaje seleccionado en la columna derecha es el mismo que el seleccionado en la izquierda, muestra una alerta
      alert('You cannot select the same character in both columns.');
    } else {
      setSelectedRightCharacter(character);
    }
  };

  const leftCharacters = characters.slice((leftPage - 1) * pageSize, leftPage * pageSize);
  const rightCharacters = characters.slice((rightPage - 1) * pageSize, rightPage * pageSize);
  const characterEpisodes = episodes.filter((episode: any) =>
    episode.characters.includes(selectedCharacter?.url)
  );

  const leftCharacterEpisodes = episodes.filter((episode) =>
    episode.characters.includes(selectedLeftCharacter?.url)
  );

  const rightCharacterEpisodes = episodes.filter((episode) =>
    episode.characters.includes(selectedRightCharacter?.url)
  );

  const sharedEpisodes = episodes.filter((episode) =>
    episode.characters.includes(selectedLeftCharacter?.url) && episode.characters.includes(selectedRightCharacter?.url)
  );

  const handleLeftPageChange = (selectedPage: { selected: number }) => {
    setLeftPage(selectedPage.selected + 1);
  };

  const handleRightPageChange = (selectedPage: { selected: number }) => {
    setRightPage(selectedPage.selected + 1);
  };

  const toggleShowMoreLeftEpisodes = () => {
    setShowMoreLeftEpisodes(!showMoreLeftEpisodes);
  };

  const toggleShowMoreSharedEpisodes = () => {
    setShowMoreSharedEpisodes(!showMoreSharedEpisodes);
  };

  const toggleShowMoreRightEpisodes = () => {
    setShowMoreRightEpisodes(!showMoreRightEpisodes);
  };

  return (
    <div className='Main'>
      <div className='DivColumnsContainer'>
        <div className='DivColumns DivColumnLeft'>
          <h2>Character #1</h2>
          <div className='ColumnCards'>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {leftCharacters.length > 0 ? (
                  leftCharacters.map((character: any, index: number) => (
                    <div key={index} onClick={() => handleLeftCharacterClick(character)}
                      className={selectedLeftCharacter === character ? 'DivSelectedCharacter DivCharacter' : 'DivCharacter'}>
                      <div>
                        <img src={character.image} alt={character.name} style={{ width: '200px', height: '200px' }} />
                      </div>
                      <div>
                        Name: {character.name}
                      </div>
                      <div>
                        Status: {character.status}
                      </div>
                      <div>
                        Species: {character.species}
                      </div>
                      <hr />
                    </div>
                  ))
                ) : (
                  <div>No characters found.</div>
                )}

              </>
            )}
          </div>
          <div className='DivPaginator'>
            <Paginator totalPages={totalPages} onPageChange={handleLeftPageChange} />
          </div>
        </div>
        <div className='DivColumns DivColumnRight'>
          <h2>Character #2</h2>
          <div className='ColumnCards'>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {rightCharacters.length > 0 ? (
                  rightCharacters.map((character: any, index: number) => (
                    <div key={index} onClick={() => handleRightCharacterClick(character)}
                      className={selectedRightCharacter === character ? 'DivSelectedCharacter DivCharacter' : 'DivCharacter'}>
                      <div>
                        <img src={character.image} alt={character.name} style={{ width: '200px', height: '200px' }} />
                      </div>
                      <div>
                        Name: {character.name}
                      </div>
                      <div>
                        Status: {character.status}
                      </div>
                      <div>
                        Species: {character.species}
                      </div>
                      <hr />
                    </div>
                  ))
                ) : (
                  <div>No characters found.</div>
                )}
              </>
            )}
          </div>
          <div className='DivPaginator'>
            <Paginator totalPages={totalPages} onPageChange={handleRightPageChange} />
          </div>
        </div>
      </div>

      <div className='DivEpisodes'>
        <div style={{ flex: 1 }}>
          <h2>Character #1<br/>Only Episodes</h2>
          {selectedLeftCharacter && selectedRightCharacter ? (
            leftCharacterEpisodes.length > 0 ? (
              leftCharacterEpisodes.slice(0, showMoreLeftEpisodes ? leftCharacterEpisodes.length : maxResults).map((episode, index) => (
                <div key={index}>
                  <div>
                    Episode Name: {episode.name}
                  </div>
                  <div>
                    Episode: {episode.episode}
                  </div>
                  <div>
                    Episode Air Date: {episode.air_date}
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <div>No episodes found for the selected character.</div>
            )
          ) : (
            <div>Please select characters from both Left and Right Columns.</div>
          )}
          {selectedLeftCharacter && selectedRightCharacter && leftCharacterEpisodes.length > maxResults && (
            <button onClick={toggleShowMoreLeftEpisodes}>{showMoreLeftEpisodes ? 'See Less' : 'See More'}</button>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2>Character #1 & Character #2 <br/> Shared Episodes</h2>
          {selectedLeftCharacter && selectedRightCharacter ? (
            sharedEpisodes.length > 0 ? (
              sharedEpisodes.slice(0, showMoreSharedEpisodes ? sharedEpisodes.length : maxResults).map((episode, index) => (
                <div key={index}>
                  <div>
                    Episode Name: {episode.name}
                  </div>
                  <div>
                    Episode: {episode.episode}
                  </div>
                  <div>
                    Episode Air Date: {episode.air_date}
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <div>No shared episodes found.</div>
            )
          ) : (
            <div>Please select characters from both Left and Right Columns.</div>
          )}
          {selectedLeftCharacter && selectedRightCharacter && sharedEpisodes.length > maxResults && (
            <button onClick={toggleShowMoreSharedEpisodes}>{showMoreSharedEpisodes ? 'See Less' : 'See More'}</button>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2>Character #2 <br/> Only Episodes</h2>
          {selectedLeftCharacter && selectedRightCharacter ? (
            rightCharacterEpisodes.length > 0 ? (
              rightCharacterEpisodes.slice(0, showMoreRightEpisodes ? rightCharacterEpisodes.length : maxResults).map((episode, index) => (
                <div key={index}>
                  <div>
                    Episode Name: {episode.name}
                  </div>
                  <div>
                    Episode: {episode.episode}
                  </div>
                  <div>
                    Episode Air Date: {episode.air_date}
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <div>No episodes found for the selected character.</div>
            )
          ) : (
            <div>Please select characters from both Left and Right Columns.</div>
          )}
          {selectedLeftCharacter && selectedRightCharacter && rightCharacterEpisodes.length > maxResults && (
            <button onClick={toggleShowMoreRightEpisodes}>{showMoreRightEpisodes ? 'See Less' : 'See More'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;


