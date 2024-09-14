import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bag from './bag.png';
import task from './task.png';
import home from './home.png';
import user from './user.png';

const Footer = () => {
  const location = useLocation();
  
  // Determine if the current path matches the link path
  const isActive = (path) => location.pathname === path;

  const renderLink = (to, imgSrc, label) => (
    <Link
      to={to}
      className="flex flex-row items-center h-10"
      // Use 'aria-current' to denote the active link for accessibility
      aria-current={isActive(to) ? 'page' : undefined}
    >
      {isActive(to) ? (
        <div className="bg-black rounded-xl flex flex-row items-center p-1 pl-3 pr-3">
          <img aria-hidden="true" alt={label} src={imgSrc} width="18" height="18" />
          <span className="ml-1">{label}</span>
        </div>
      ) : (
        <>
          <img aria-hidden="true" alt={label} src={imgSrc} className='relative' width="20" height="20" />
        </>
      )}
    </Link>
  );

  return (
    <div className="flex justify-around w-full max-w-md m-2 font-thin font-sans text-xs">
      {renderLink("/", home, "Home")}
      {renderLink("/tasks", task, "Tasks")}
    
      {renderLink("/squad", user, "Squad")}
    </div>
  );
};

export default Footer;
