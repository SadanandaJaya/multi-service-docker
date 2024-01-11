import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

function Fib() {
  const [fibState, setFibState] = useState({
    seenIndexes: [],
    values: {},
    index: '',
  });

  const fetchValues = useCallback(async () => {
    const values = await axios.get('/api/values/current');

    setFibState((prevState) => ({ ...prevState, values: values?.data }));
  }, []);

  const fetchIndexes = useCallback(async () => {
    const seenIndexes = await axios.get('/api/values/all');

    setFibState((prevState) => ({
      ...prevState,
      seenIndexes: seenIndexes?.data,
    }));
  }, []);

  const renderSeenIndexes = () => {
    return fibState.seenIndexes?.map(({ number }) => number)?.join(', ');
  };

  const renderValues = () => {
    const entries = [];
    for (let key in fibState.values) {
      entries.push(
        <div key={key}>
          For index {key} i calculated {fibState.values[key]}
        </div>
      );
    }
    return entries;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('/api/values', {
      index: fibState.index,
    });

    setFibState({ ...fibState, index: '' });
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={fibState.index}
          onChange={(e) => setFibState({ ...fibState, index: e.target.value })}
        />
        <button>submit</button>
      </form>

      <h3>Indexes i habe seen:</h3>
      <>{renderSeenIndexes()}</>

      <h3>Calculates values:</h3>
      <>{renderValues()}</>
    </div>
  );
}

export default Fib;
