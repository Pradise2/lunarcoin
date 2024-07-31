import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
      <div className="flex justify-around w-full max-w-md mt-4 font-thin font-sans text-xs">
      <Link to="/"  className="flex flex-col items-center">
      <span className="material-icons text-zinc-400">layers</span>
      Home
      </Link>
          <Link to="/tasks"className="flex flex-col items-center">
          <span className="material-icons text-zinc-400">assignment</span>
        Tasks
      </Link>
      <Link to="/squad"className="flex flex-col items-center">
      <span className="material-icons text-zinc-400">group</span>
        Squad
      </Link>
      
      </div>
  );
};

export default Footer;