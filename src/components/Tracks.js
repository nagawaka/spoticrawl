import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { get } from 'litedash';
import Decimal from 'decimal.js';

const filters = [
  {
    key: "default",
    path: "key",
  },
  {
    key: "popularity",
    path: "popularity",
    invert: true,
  },
  {
    key: "danceability",
    path: "features.danceability",
    invert: true,
  },
  {
    key: "energy",
    path: "features.energy",
    invert: true,
  },
  {
    key: "key",
    path: "features.key",
    invert: true,
  },
  {
    key: "loudness",
    path: "features.loudness",
    invert: true,
  },
  {
    key: "acousticness",
    path: "features.acousticness",
    invert: true,
  },
]

const Tracks = () => {
  const id = useParams().id;
  
  const [tracks, setTracks] = useState([]);
  const [filter, setFilter] = useState(filters[0]);

  useEffect(() => {
    (async () => {
      const data = await axios.get(`http://localhost:3001/toptracks/${id}`);
      setTracks(data.data);
    })();
  }, []);

  useEffect(() => {
    const filteredTracks = [...tracks].sort((a, b) => (new Decimal(get(a, filter.path)).comparedTo(new Decimal(get(b, filter.path)))));
    if (filter.invert) filteredTracks.reverse();
    setTracks(filteredTracks);
  }, [filter]);

  return <>
    <h1>Tracks</h1>

    <ul>
      {filters.map((el) => <li style={{ color: filter === el ? '#FF0000' : '#000000' }} onClick={() => setFilter(el)}>{el.key}</li>)}
    </ul>
    <ol>
      {tracks.map((track) => <li key={track.id}>
        <p>{track.name} by <strong>{track.artists.map((artist) => artist.name).join(', ')}</strong> ({get(track, filter.path)})</p>
      </li>)}
    </ol>
  </>;
}

export default Tracks;