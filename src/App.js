import React, { useState, useEffect } from 'react';
import Target from './components/Target';

const App = () => {
  const [coords, setCoords] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords(`${pos.coords.latitude}, ${pos.coords.longitude}`);
    });
  }, []);

  return (
    <div>
      <Target coords={coords} setCoords={setCoords} />
    </div>
  );
};

export default App;
