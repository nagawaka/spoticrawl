import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import { get } from 'litedash';

const filters = [
  {
    key: "default",
    path: "key",
  },
  {
    key: "popularity",
    path: "popularity",
  },
  {
    key: "danceability",
    path: "features.danceability",
  },
  {
    key: "energy",
    path: "features.energy",
  },
  {
    key: "key",
    path: "features.key",
  },
  {
    key: "loudness",
    path: "features.loudness",
  },
  {
    key: "acousticness",
    path: "features.acousticness",
  },
]

const Tracks = ({ id }) => {
  const [tracks, setTracks] = useState([]);
  const [filter, setFilter] = useState(filters[0]);

  useEffect(() => {
    (async () => {
      const data = await axios.get(`http://localhost:3001/toptracks/${id}`);
      setTracks(data.data);
    })();
  }, []);

  useEffect(() => {
    const filteredTracks = [...tracks].sort((a,b) => get(a, filter.path) - get(b, filter.path));
    console.log(filteredTracks);
    setTracks(filteredTracks);
  }, [filter]);

  return <>
    <ul>
      {filters.map((el) => <li style={{ color: filter===el ? '#FF0000' : '#000000' }} onClick={() => setFilter(el)}>{el.key}</li>)}
    </ul>
    <ol>
      {tracks.map((track) => <li key={track.id}>
        <p>{track.name} by <strong>{track.artists.map((artist) => artist.name).join(', ')}</strong> ({get(track, filter.path)})</p>
      </li>)}
    </ol>
  </>;
}

const Page = <div><h1>Tracks</h1><Tracks id="4NSbUIfUAkaedUIm8eJ631" /></div>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(Page);