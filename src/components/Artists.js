import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArtistList = ({ artists }) => (
  <>
    <h2>Results</h2>
    <ul>
      {artists.map((artist) => (
        <li key={artist.id}>
          <Link to={`/tracks/${artist.id}`}><img src={artist.images[0]?.url} />
          <p>{artist.name}<br/>
          {artist.popularity}</p>
          </Link>
        </li>
      ))}
    </ul>
  </>
)

const Artists = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    console.log(params.id);
  }, []);

  useEffect(() => {
    navigate(`/search/${query}`);
  }, [artists]);

  const search = async (evt) => {
    evt.preventDefault();
    const list = await axios.get(`http://127.0.0.1:3001/artists/${encodeURI(query)}`);
    setArtists(list.data);
  }

  return <>
    <h1>Spotiwhatevers</h1>

    <form onSubmit={search}>
      <input onChange={(e) => setQuery(e.currentTarget.value)} value={query}></input>
      <button>Search</button>
    </form>

    {artists.length > 0 && <ArtistList artists={artists} />}
  </>;
}

export default Artists;