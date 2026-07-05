import { useEffect, useState } from 'react';
import CreateNote from './components/CreateNote';
import RevealNote from './components/RevealNote';
import NotesList from './components/NotesList';
import { initFeatureFlags, isVariantBEnabled } from './featureFlags';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [variantB, setVariantB] = useState(false);

  useEffect(() => {
    initFeatureFlags();
    setVariantB(isVariantBEnabled());
  }, []);

  return (
    <div className="app" data-theme={variantB ? 'variant-b' : 'variant-a'}>
      <h1>Secret Notes</h1>
      <p>Notes are encrypted on the server and can only be read with the correct passphrase.</p>

      <CreateNote onCreated={() => setRefreshKey((k) => k + 1)} />

      <NotesList
        refreshKey={refreshKey}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <RevealNote noteId={selectedId} />
    </div>
  );
}

export default App;
