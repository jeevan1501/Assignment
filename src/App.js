import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [planets, setPlanets] = useState([]);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    fetchPlanets('https://swapi.dev/api/planets/');
  }, []);

  const fetchPlanets = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const planetsWithResidents = await Promise.all(data.results.map(async (planet) => {
        const residents = await fetchResidents(planet.residents);
        return { ...planet, residents };
      }));
      setPlanets(planetsWithResidents);
      setNextPage(data.next);
    } catch (error) {
      console.error('Error fetching planets:', error);
    }
  };

  const fetchResidents = async (residentUrls) => {
    try {
      const promises = residentUrls.map(url => fetch(url).then(response => response.json()));
      const residentsData = await Promise.all(promises);
      return residentsData;
    } catch (error) {
      console.error('Error fetching residents:', error);
      return [];
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchPlanets(nextPage);
    }
  };

  const renderResidents = (residents) => {
    return residents.map((resident, index) => (
      <li key={index}>
        <strong>Name:</strong> {resident.name}, <strong>Height:</strong> {resident.height}, <strong>Mass:</strong> {resident.mass}, <strong>Gender:</strong> {resident.gender}
      </li>
    ));
  };

  return (
    <div className="App">
      <h1>Star Wars Planets Directory</h1>
      <div className="planets">
        {planets.map((planet, index) => (
          <div key={index} className="planet-card">
            <h2>{planet.name}</h2>
            <p><strong>Climate:</strong> {planet.climate}</p>
            <p><strong>Population:</strong> {planet.population}</p>
            <p><strong>Terrain:</strong> {planet.terrain}</p>
            <h3>Residents:</h3>
            <ul>
              {planet.residents.length > 0 ? renderResidents(planet.residents) : <li>No residents</li>}
            </ul>
          </div>
        ))}
      </div>
      {nextPage && <button onClick={handleNextPage}>Next Page</button>}
    </div>
  );
}

export default App;
