import React from 'react'
import './Home.css'


const Home = () => {
  return (
    // Renamed .home to .cams-home-section and removed .container class
    <div className='cams-home-section cams-container'> 
        <div className="cams-hero-text"> {/* Renamed class here */}
            <h1>Your Complete Digital Admission Partner</h1>
            <p>We ensure better education for better future in a hassle free way</p>
            {/* Renamed button class to cams-btn, assuming it's defined globally or in shared button CSS */}
            <button className='cams-btn'></button>
        </div>
    </div>
  )
}

export default Home;