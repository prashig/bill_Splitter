import React, { useState } from 'react';
import Upload from './components/Upload';
import BillItems from './components/BillItems';
import People from './components/People';
import Results from './components/Results';
import Home from './components/Home';

function App() {
  // Navigation
  const [screen, setScreen] = useState('home');

  // Bill state
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');

  // People state
  const [people, setPeople] = useState([]);
  const [splitMode, setSplitMode] = useState('even'); // 'even' or 'custom'
  const [itemAssignments, setItemAssignments] = useState({});

  // Navigation helpers
  const handleNavigate = (next) => setScreen(next);
  const handleBack = () => setScreen('home');
  const handleReset = () => {
    setItems([]);
    setTax('');
    setTip('');
    setPeople([]);
    setSplitMode('even');
    setItemAssignments({});
    setScreen('home');
  };

  return (
    <div>
      {screen === 'home' && <Home onNavigate={handleNavigate} />}
      
      {screen === 'upload' && (
        <Upload 
          onNavigate={handleNavigate}
          onItemsDetected={(detectedItems) => setItems(detectedItems)}
        />
      )}
      
      {screen === 'billItems' && (
        <BillItems
          items={items}
          setItems={setItems}
          tax={tax}
          setTax={setTax}
          tip={tip}
          setTip={setTip}
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
        />
      )}
      
      {screen === 'people' && (
        <People
          items={items}
          people={people}
          setPeople={setPeople}
          splitMode={splitMode}
          setSplitMode={setSplitMode}
          itemAssignments={itemAssignments}
          setItemAssignments={setItemAssignments}
          tax={tax}
          tip={tip}
          onNavigate={handleNavigate}
          onBack={() => setScreen('billItems')}
        />
      )}
      
      {screen === 'results' && (
        <Results
          items={items}
          people={people}
          tax={tax}
          tip={tip}
          splitMode={splitMode}
          itemAssignments={itemAssignments}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
