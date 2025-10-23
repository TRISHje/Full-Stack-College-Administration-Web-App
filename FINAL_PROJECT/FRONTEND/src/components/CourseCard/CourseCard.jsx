

import React from 'react';
import './CourseCard.css';


const CourseCard = ({ title, description, imageUrl, buttonText }) => {
  return (
    <div className="card">
      <div className="imageContainer">
        <img src={imageUrl} alt={title} className="image" />
      </div>
      <div className="content">
        <h4 className="title">{title}</h4>
        <p className="description">{description}</p>
        <button className="button">{buttonText}</button>
      </div>
    </div>
  );
};

export default CourseCard;