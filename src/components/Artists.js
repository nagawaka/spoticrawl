import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArtistList = ({ artists }) => (
  <div className="container mx-auto">
    <h2>Results</h2>

    <div className="columns-4">
      {artists.map((artist) => (
        <Link to={`/tracks/${artist.id}`} key={artist.id}>
          <div className="flex flex-col hover:opacity-75">
            <div>
            {artist.images[0] ? <img src={artist.images[0]?.url} className="w-full" /> : <div className="h-64 w-full" style={{backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`}}>{artist.name}</div>}
            </div>
            <div>
              <p>{artist.name} ({artist.followers.total})</p>
            </div>
          </div>
        </Link>
      ))}      
    </div>
  </div>
)

const Artists = () => {
  const inputTextElement = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const [doSearch, setSearch] = useState(true);
  const [query, setQuery] = useState(params.id || '');
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    (async () => {
      await navigate(`/search/${inputTextElement.current.value}`);
    })();
  }, [artists]);

  useEffect(() => {
    console.log(query, params.id);
    setSearch(true);
    setQuery(params.id)
  }, [params.id]);

  useEffect(() => {
    if (doSearch) search(new Event(''));
  }, [doSearch]);

  const search = async (evt) => {
    evt.preventDefault();
    const list = await axios.get(`/api/artists/${encodeURI(inputTextElement.current.value)}`);
    setSearch(false);
    setArtists(list.data);
  }

  return <>
    <div className="mb-4">
      <form onSubmit={search}>
        <input onChange={(e) => setQuery(e.currentTarget.value)} ref={inputTextElement} value={query} className="border-solid border-y-2 border-l-2 border-black p-4"></input>
        <button className="border-solid border-y-2 border-r-2 border-black p-4">Search</button>
      </form>
    </div>

    {artists.length > 0 && <ArtistList artists={artists} />}
  </>;
}

export default Artists;