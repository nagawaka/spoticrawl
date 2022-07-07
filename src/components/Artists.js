import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArtistList = ({ artists }) => (
  <>
    <h2>Results</h2>

    <div>
      {artists.map((artist) => (
        <div className="w-1/4" key={artist.id}>
          <Link to={`/tracks/${artist.id}`}><img src={artist.images[0]?.url} />
          <p>{artist.name}<br/>
          {artist.popularity}</p>
          </Link>
        </div>
      ))}      
    </div>
  </>
)

const Artists = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(params.id || '');
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (query !== '') search(new Event(''));
  }, [params.id]);

  const search = async (evt) => {
    evt.preventDefault();
    const list = await axios.get(`/api/artists/${encodeURI(query)}`);
    await navigate(`/search/${query}`);
    setArtists(list.data);
  }

  return <>
    <h1 className="test">Spotiwhatevers</h1>

    <form onSubmit={search}>
      <input onChange={(e) => setQuery(e.currentTarget.value)} value={query}></input>
      <button>Search</button>
    </form>

    {artists.length > 0 && <ArtistList artists={artists} />}
  </>;
}

export default Artists;