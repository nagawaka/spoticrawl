import React from 'react';
import { Outlet } from 'react-router-dom';


const Page = () => <><h1 className="text-3xl font-bold underline">Welcome!</h1><Outlet/></>;

export default Page;