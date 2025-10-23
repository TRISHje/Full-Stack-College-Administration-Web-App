import React from 'react'
import './Courses.css'
import AIimage from '../../assets/AI.jpg'
import Elimage from '../../assets/Electrical.jpg'
import compimage from '../../assets/comp.jpg'
import CourseCard from '../CourseCard/Coursecard'
import { Link } from 'react-router-dom';
const courses = [
  {
    id: 1,
    title: "Computer Science Engineering",
    description: "Learn fundamental principles of computer science, software development, and data structures.",
    imageUrl: compimage,
  },
  {
    id: 2,
    title: "Electrical Engineering",
    description: "Explore the design, development, and maintenance of electrical and electronic systems.",
    imageUrl: Elimage,
  },
  {
    id: 3,
    title: "Artificial Intelligence Engineering",
    description: "Explore skills to design, develop, and deploy intelligent systems.",
    imageUrl: AIimage,
  },
];

const  Courses= () => {
  return (
      <div className="courses">
         <div className="coursecontain">
      
        {courses.map(course => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            imageUrl={course.imageUrl}
            buttonText="Enroll Now"
          />
        ))}
    
        </div>
      <Link to="/signup" className='btn btn-primary'>
        See more here
      </Link>
    </div>





  )
}

export default Courses




{/* <div className={styles.container}>
      <h2>Available Courses</h2>
      <div className={styles.cardGrid}>
        {courses.map(course => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            imageUrl={course.imageUrl}
            buttonText="Enroll Now"
          />
        ))}
      </div>
    </div> */}