import React from 'react'
import './About.css'
import abpic from '../../assets/about.jpg'

const About = () => {
  return (
    <div className='about'>
      <div className="about-left">
          <img src={abpic} alt="" className='aboutimg'/>
          
      </div>
      <div className="about-right">
        <h3>About CAMS</h3>
        <h2>Redefining Admissions for our college</h2>
        <p>

         Our College Admission Management System is a dedicated
         platform designed exclusively for managing the admission 
         process of our college. From online applications and document
         submissions to seat allocation and final enrollment, the system 
         streamlines every step. Students can easily explore available programs,
         compare course details, and select their desired course based 
         on interest and eligibility. The platform ensures transparency, 
         accuracy, and faster decision-making, making the admission journey 
         smooth and hassle-free for both applicants and administrators.

        </p>
      </div>
    </div>
  )
}

export default About