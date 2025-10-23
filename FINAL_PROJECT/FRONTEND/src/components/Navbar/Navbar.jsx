import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/CAMS.png'
import { Link } from 'react-scroll'; // Assuming react-scroll is used for internal page navigation
import { Link as RouteLink} from 'react-router-dom'; // React Router Link

const Navbar = () => {
  const [sticky,setsticky]= useState(false);
  useEffect(()=>{
    window.addEventListener('scroll',()=>{
      window.scrollY>500 ? setsticky(true) : setsticky(false);
    })
  },[]);

  return (
    // Renamed 'nav' to 'cams-navbar' and 'container' to 'cams-container'
    <nav className={`cams-navbar cams-container ${sticky ? 'cams-dark-navbar' :''} text-white`}>
      <img src={logo} alt="" className='cams-logo' /> {/* Renamed class */}
      <ul className=''>
        <li><Link to='home' smooth={true} duration={500} offset={0}>Home</Link></li>
        <li><Link to='about' smooth={true} duration={500} offset={-120}>About</Link></li>
        <li><Link to='courses' smooth={true} duration={500} offset={-170}>Courses</Link></li>
        <li><Link to='notice' smooth={true} duration={500} offset={-260}>Notice</Link></li>
        <li><Link to='contact' smooth={true} duration={500} offset={-260}>Contact us</Link></li>
        <li><RouteLink to='/login' className='text-decoration-none text-white'>Login/Sign up</RouteLink></li>
        {/* Changed button class to cams-btn for consistency */}
        <li><RouteLink to='/adminLogin' className='text-decoration-none text-white'><button className='cams-btn'>Admin</button></RouteLink></li> 
      </ul>
    </nav>
  )
}

export default Navbar;