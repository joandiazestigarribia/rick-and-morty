'use client'
import React, { useEffect, useState } from 'react';
import Paginator from './Paginator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const MainComponent: React.FC = () => {
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

  const pageSize = 4;
  const maxResults = 5;

  useEffect(() => {
    const fetchDataCharacter = async () => {
      try {
        let allCharacters: any[] = [];
        let nextPage = 1;

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


  const handleLeftCharacterClick = (character: any) => {
    if (selectedRightCharacter && selectedRightCharacter.id === character.id) {
      toast.error('You cannot select the same character in both columns.')
    } else {
      setSelectedLeftCharacter(character);
    }
  };

  const handleRightCharacterClick = (character: any) => {
    if (selectedLeftCharacter && selectedLeftCharacter.id === character.id) {
      toast.error('You cannot select the same character in both columns.')
    } else {
      setSelectedRightCharacter(character);
    }
  };

  const leftCharacters = characters.slice((leftPage - 1) * pageSize, leftPage * pageSize);
  const rightCharacters = characters.slice((rightPage - 1) * pageSize, rightPage * pageSize);

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
    <div className='Container'>
      <div className='Main'>
        <Image src="/fondo-rick-and-morty-2.jpg" alt="Fondo" width={1000} height={700} className='BackgroundImage' />
        <div className='DivLogo'>
          <Image src="/logo-rick-and-morty-2.png" alt="My Image" width={384} height={149} />
        </div>
        <div className='DivColumnsContainer'>
          <div className='DivColumns DivColumnLeft'>
            <h2>CHARACTER #1</h2>
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
                        <div className='DivName DivCharacterInfo'>
                          Name: <span className='Name CharacterInfo'>{character.name}</span>
                        </div>
                        <div className='DivStatus DivCharacterInfo'>
                          Status: <span className='Status CharacterInfo'>{character.status}</span>
                        </div>
                        <div className='DivSpecies DivCharacterInfo'>
                          Species: <span className='Species CharacterInfo'>{character.species}</span>
                        </div>
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
            <h2>CHARACTER #2</h2>
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
                        <div className='DivName DivCharacterInfo'>
                          Name: <span className='Name CharacterInfo'>{character.name}</span>
                        </div>
                        <div className='DivStatus DivCharacterInfo'>
                          Status: <span className='Status CharacterInfo'>{character.status}</span>
                        </div>
                        <div className='DivSpecies DivCharacterInfo'>
                          Species: <span className='Species CharacterInfo'>{character.species}</span>
                        </div>
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
          <div>
            <div style={{ flex: 1 }}>
              <h2>Character #1 <br /> Only Episodes</h2>
              {selectedLeftCharacter && selectedRightCharacter ? (
                leftCharacterEpisodes.length > 0 ? (
                  leftCharacterEpisodes.slice(0, showMoreLeftEpisodes ? leftCharacterEpisodes.length : maxResults).map((episode, index) => (
                    <div key={index} className='DivListEpisodes'>
                      <div className='ListEpisodesInfo'>
                        Episode Name: <span className='Name EpisodesInfo'>{episode.name}</span>
                      </div>
                      <div className='ListEpisodesInfo'>
                        Episode: <span className='Episode EpisodesInfo'>{episode.episode}</span>
                      </div>
                      <div className='ListEpisodesInfo'>
                        Episode Air Date: <span className='EpisodeAir EpisodesInfo'>{episode.air_date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No episodes found for the selected character.</div>
                )
              ) : (
                <div className='SelectBothCharacters'>Please select characters from both columns.</div>
              )}
            </div>
            {selectedLeftCharacter && selectedRightCharacter && leftCharacterEpisodes.length > maxResults && (
              <div className='DivButtonShowMore'>
                <button onClick={toggleShowMoreLeftEpisodes}>{showMoreLeftEpisodes ? 'See Less' : 'See More'}</button>
              </div>

            )}
          </div>
          <div>
            <div style={{ flex: 1 }}>
              <h2>Character #1 & Character #2 <br /> Shared Episodes</h2>
              {selectedLeftCharacter && selectedRightCharacter ? (
                sharedEpisodes.length > 0 ? (
                  sharedEpisodes.slice(0, showMoreSharedEpisodes ? sharedEpisodes.length : maxResults).map((episode, index) => (
                    <div key={index} className='DivListEpisodes'>
                      <div className='ListEpisodesInfo'>
                        Episode Name: <span className='Name EpisodesInfo'>{episode.name}</span>
                      </div>
                      <div className='ListEpisodesInfo'>
                        Episode: <span className='Episode EpisodesInfo'>{episode.episode}</span>
                      </div>
                      <div className='ListEpisodesInfo'>
                        Episode Air Date: <span className='EpisodeAir EpisodesInfo'>{episode.air_date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='DivNoEpisodesFound'>
                    <div className='NoEpisodesFound'>
                      No shared episodes found.
                    </div>
                  </div>
                )
              ) : (
                <div className='SelectBothCharacters'>Please select characters from both columns.</div>
              )}

            </div>
            {selectedLeftCharacter && selectedRightCharacter && sharedEpisodes.length > maxResults && (
              <div className='DivButtonShowMore'>
                <button onClick={toggleShowMoreSharedEpisodes}>{showMoreSharedEpisodes ? 'See Less' : 'See More'}</button>
              </div>
            )}
          </div>

          <div>
            <div style={{ flex: 1 }}>
              <h2>Character #2 <br /> Only Episodes</h2>
              {selectedLeftCharacter && selectedRightCharacter ? (
                rightCharacterEpisodes.length > 0 ? (
                  rightCharacterEpisodes.slice(0, showMoreRightEpisodes ? rightCharacterEpisodes.length : maxResults).map((episode, index) => (
                    <div key={index} className='DivListEpisodes'>
                      <div className='ListEpisodesInfo'>
                        Episode Name: <span className='Name EpisodesInfo'>{episode.name}</span>
                      </div>
                      <div className='ListEpisodesInfo'>
                        Episode: <span className='Episode EpisodesInfo'>{episode.episode}</span>
                      </div>
                      <div className='ListEpisodesInfo'>
                        Episode Air Date: <span className='EpisodeAir EpisodesInfo'>{episode.air_date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No episodes found for the selected character.</div>
                )
              ) : (
                <div className='SelectBothCharacters'>Please select characters from both columns.</div>
              )}

            </div>
            {selectedLeftCharacter && selectedRightCharacter && rightCharacterEpisodes.length > maxResults && (
              <div className='DivButtonShowMore'>
                <button onClick={toggleShowMoreRightEpisodes}>{showMoreRightEpisodes ? 'See Less' : 'See More'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;


