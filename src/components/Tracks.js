import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { get } from 'litedash';
import Decimal from 'decimal.js';
import * as d3 from 'd3';

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

  const [values, setValues] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await axios.get(`/api/toptracks/${id}`);
      setTracks(data.data);
    })();
  }, []);

  useEffect(() => {
    const arr = [...tracks.map((track) => get(track, filter.path))];
    setValues(arr);
  }, [filter]);

  useEffect(() => {
    const width = window.innerWidth - 40 - 30;
    const height = 400 - 40;

    const comparison = tracks.map((track) => get(track, 'popularity'));

    d3.select('svg').selectAll('*').remove();

    const svg = d3.select('svg').append('g').attr('transform', 'translate(40,10)');
    const x = d3.scaleLinear()
      .domain([d3.min(values), d3.max(values)])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(tracks.map(track => get(track, 'popularity')))])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    svg.append('g')
      .selectAll("dot")
      .data(tracks)
      .enter()
      .append("circle")
        .attr("cx", function (d) {
          console.log(get(d, filter.path));
          return x(get(d, filter.path));
        } )
        .attr("cy", function (d) { 
          return y(get(d, 'popularity'));
        } )
        .attr("r", 10)
        .style("fill", "#69b3a2")

  }, [values])

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
    <svg width="100%" height={400}></svg>
  </>;
}

export default Tracks;