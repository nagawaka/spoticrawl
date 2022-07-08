import React from 'react';
import { Outlet } from 'react-router-dom';


const Page = () => <div className="container mx-auto"><h1 className="text-3xl font-bold underline">Spotiwhatevers</h1><Outlet/></div>;

export default Page;