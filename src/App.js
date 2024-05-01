import React,{useState} from 'react';

import Homepage from './components/Homepage'; // Adjust the path to the Homepage component

function App() {
  const [isDarkMode, setIsDarkMode] = useState('light');
  return (
      <Homepage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
  );
}

export default App;
