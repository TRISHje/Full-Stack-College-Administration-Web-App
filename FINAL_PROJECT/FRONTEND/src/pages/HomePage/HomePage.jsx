// src/pages/HomePage.jsx

import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Home from '../../components/Home/Home';
import Programs from '../../components/Programs/programs';
import Title from '../../components/Title/Title';
import About from '../../components/About/About';
import Courses from '../../components/Courses/Courses';
import Notice from '../../components/Notice/Notice';
import Contact from '../../components/Contact/Contact';
import Footer from '../../components/Footer/Footer'

const HomePage = () => {
  return (
    <>
      <Navbar/>
      <Home/>
      <div className="container">
        <About />
        <Title subtitle="Our programs" title="what we offer" />
        <Programs />
        <Title subtitle="Courses" title="Available courses" />
        <Courses />
        <Title subtitle="Notice" title="Latest announcements" />
        <Notice />
        <Title subtitle="Contact Us" title="Get in touch" />
        <Contact />
        <Footer/>
      </div>
    </>
  );
};

export default HomePage;