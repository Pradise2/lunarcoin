import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bag from './bag.png';
import task from './task.png';
import home from './home.png';
import user from './user.png';

const Footer = () => {
  const [isHome, setIsHome] = useState(false);
  const [isTask, setIsTask] = useState(false);
  const [isSquad, setIsSquad] = useState(false);
  const [isEarn, setIsEarn] = useState(false);

  const renderLink = (to, imgSrc, label, isHovered, setIsHovered) => (
    <Link
      to={to}
      className="flex  flex-row items-center h-10" // Fixed height class applied here
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <img aria-hidden="true" alt={label} src={imgSrc} className='relative' width="20" height="20" />
      ) : (
        <div className="bg-black rounded-xl flex flex-row items-center p-1 pl-3 pr-3">
          <img aria-hidden="true" alt={label} src={imgSrc} width="18" height="18" />
          <span className="ml-1">{label}</span>
        </div>
      )}
    </Link>
  );

  return (
    <div className="flex justify-around w-full max-w-md m-2 font-thin font-sans text-xs">
      {renderLink("/", home, "Home", isHome, setIsHome)}
      {renderLink("/tasks", task, "Tasks", isTask, setIsTask)}
      {renderLink("/earn", bag, "Earn", isEarn, setIsEarn)}
      {renderLink("/squad", user, "Squad", isSquad, setIsSquad)}
    </div>
  );
};

export default Footer;
