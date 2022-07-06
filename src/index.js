import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles/styles.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Page from './components/Page.js'
import Artists from './components/Artists.js'
import Tracks from './components/Tracks.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Page />}>
        <Route index element={<Artists />} />
        <Route path="search" element={<Artists />}>
          <Route path=":id" element={<Artists />} />
        </Route>
        <Route path="tracks/:id" element={<Tracks />} />
      </Route>
    </Routes>
  </BrowserRouter>
);