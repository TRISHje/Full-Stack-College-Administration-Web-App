/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import studentImage from '../assets/college-student-read-book-illustration.png'; // Your image import

// Helper function to render star icons - now a standalone utility
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" className="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>
    );
  }

  if (hasHalfStar) {
    stars.push(
      <svg key="half" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" className="bi bi-star-half" viewBox="0 0 16 16">
        <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.5.5 0 0 1 16 6.32a.5.5 0 0 1-.189.479l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.746-.592l.83-4.73L.173 6.765a.5.5 0 0 1 .282-.95l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.5.5 0 0 1 .145-.483l2.92-2.794-4.072-.579a.5.5 0 0 1-.362-.259L8.017 2.22a.5.5 0 0 1-.035-.12A.5.5 0 0 1 7.5 2.5c-.145 0-.292.062-.354.119L4.924 7.304a.5.5 0 0 1-.362.259l-4.072.579 2.92 2.794a.5.5 0 0 1 .145.483l-.694 3.957 3.686-1.894a.5.5 0 0 1 .232-.056z"/>
      </svg>
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D3D3D3" className="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.416.447.854.81.65L8 12.012l4.324 2.818c.363.204.89-.234.81-.65L12.289 9.88l3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.516.516 0 0 0-.927 0L5.354 5.119l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.5.5 0 0 0-.145-.483L1.87 7.705l4.072-.579a.5.5 0 0 0 .362-.259L8 2.473l1.843 3.653a.5.5 0 0 0 .362.259l4.072.579-2.92 2.794a.5.5 0 0 0-.145.483l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
      </svg>
    );
  }
  return stars;
};

// Header Component (modified to be functional for props)
const Header = ({ title }) => {
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top`}>
      <div className="container-fluid container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <span className="fs-3 fw-bold text-dark">{title}</span>
          <span className="ms-2" style={{ width: '8px', height: '8px', backgroundColor: '#6c63ff', borderRadius: '50%' }}></span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className=" navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link fw-semibold text-muted mx-3" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold text-muted mx-3" href="#course-section">Courses</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold text-muted mx-3" href="#testimonial-section">Testimonial</a>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-primary rounded-pill py-2 px-4 me-2">Sign In</button>
            <button className="btn btn-primary rounded-pill py-2 px-4">Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Component (from previous code)
const Hero = () => {
  return (
    <header className='container-fluid py-5 mt-5'>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <div className="d-inline-flex align-items-center text-success fw-bold mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              <span>Get 10% off on first enroll</span>
            </div>
            <h1 className="display-4 fw-bolder mb-4">Advance your Engineering skills with us.</h1>
            <p className="lead text-muted mb-4">
              Build your skills with our world-class courses.
            </p>

            <SearchBar />

            {/* Feature Highlights */}
            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start mt-4">
              <div className="d-flex align-items-center me-sm-4 mb-2 mb-sm-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <span className="text-muted fw-semibold">Flexible</span>
              </div>
              <div className="d-flex align-items-center me-sm-4 mb-2 mb-sm-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <span className="text-muted fw-semibold">Learning path</span>
              </div>
              <div className="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <span className="text-muted fw-semibold">Community</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6 position-relative d-flex justify-content-center">
            <img
              src={studentImage}
              className="img-fluid rounded-4 shadow-lg"
              alt="Student studying"
              style={{ maxWidth: '500px', height: 'auto' }}
            />
            {/* "No. of students" chart overlay */}
            <div className="card p-2 shadow-sm border-0 position-absolute top-0 end-0 me-4 mt-4" style={{ width: '100px'}}>
              <div className="card-body p-2">
                <h6 className="card-subtitle mb-2 text-muted text-center" style={{ fontSize: '0.75rem' }}>No. of students</h6>
                <div className="d-flex justify-content-between align-items-end" style={{ height: '50px' }}>
                  <div className="bg-primary rounded" style={{ width: '10px', height: '33.3%' }}></div>
                  <div className="bg-warning rounded" style={{ width: '10px', height: '50%' }}></div>
                  <div className="bg-danger rounded" style={{ width: '10px', height: '66.6%' }}></div>
                  <div className="bg-success rounded" style={{ width: '10px', height: '100%' }}></div>
                </div>
              </div>
            </div>
            {/* "50+ Available courses" overlay */}
            <div className="card p-2 shadow-sm border-0 position-absolute bottom-0 start-0 ms-4 mb-4" style={{ maxWidth: '200px' }}>
              <div className="d-flex align-items-center">
                <span className="bg-primary bg-opacity-10 text-primary rounded-circle me-2 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-book-half" viewBox="0 0 16 16">
                    <path d="M8.5 2.687a.5.5 0 0 0-.875-.417L.95 6.014v-.004L.083 6.438a.5.5 0 0 0-.006.914l.05.022.02.016L1.87 8.5H1.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h1.5l1 2.375a.5.5 0 0 0 .875.417L15.05 9.986l.004.004.083-.424a.5.5 0 0 0-.006-.914l-.05-.022-.02-.016L14.13 7.5H14.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H13.5zM3 9h-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.5zm10 0h-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.5z"/>
                  </svg>
                </span>
                <div>
                  <h5 className="card-title fw-bold m-0">50+</h5>
                  <p className="card-text text-muted" style={{ fontSize: '0.85rem' }}>Available courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// SearchBar Component (from previous code)
const SearchBar = () => {
  return (
    <div className="input-group mb-5 shadow-lg rounded-pill" style={{ maxWidth: '500px' }}>
      <input type="text" name="" id="" className="form-control rounded-pill border-0 py-3 ps-4" placeholder='Search for courses, and more...' />
      <button className="btn btn-primary rounded-circle position-absolute end-0 top-50 translate-middle-y me-2" type="button" style={{ width: '50px', height: '50px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
      </button>
    </div>
  );
};

const CourseDisplay = () => {
  const [courses, setCourses] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const rating = 5;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const url = "http://localhost:8081/courses/getAllCourses";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setErrorMsg("Failed to load courses. Please try again later.");
    }
  };

  const getCourseAbbreviation = (courseName) => {
    if (!courseName || typeof courseName !== 'string') {
      return '';
    }
    const words = courseName.split(' ');
    const abbreviation = words.map(word => word.charAt(0).toUpperCase()).join('');
    return abbreviation.slice(2, abbreviation.length);
  };

  // Function to chunk the courses into groups of 3
  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  // Chunk the courses into groups of 3
  const courseChunks = chunkArray(courses, 3);

  return (
    <section className="container py-5" id='course-section'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bolder">Popular courses.</h2>
        <a href="#" className="text-primary text-decoration-none fw-semibold">
          Explore courses <span aria-hidden="true">&rsaquo;</span>
        </a>
      </div>

      <div id="courseCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {courseChunks.map((chunk, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {chunk.map((course) => (
                  <div className="col" key={course.courseCode}>
                    <div className="card h-100 shadow-sm rounded-4 overflow-hidden">
                      <div className="position-relative">
                        <img
                          src={`https://placehold.co/300x200/87CEEB/000000?text=${getCourseAbbreviation(course.courseName)}`}
                          className="card-img-top"
                          alt={course.courseName}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {course.isBestSeller && (
                          <span
                            className="badge bg-primary position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill"
                            style={{ fontSize: '0.85rem' }}
                          >
                            Best <br /> Seller
                          </span>
                        )}
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold mb-1">{course.courseName}</h5>
                        <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>{course.courseCode}</p>
                        <div className="d-flex align-items-center mb-3">
                          <span className="fw-bold me-1">{rating}</span>
                          <div className="d-flex me-auto">
                            {renderStars(rating)}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between text-muted mt-auto" style={{ fontSize: '0.85rem' }}>
                          <span>
                            <i className="bi bi-journal-text me-1"></i>
                            {course.duration} days
                          </span>
                          <span>
                            <i className="bi bi-people-fill me-1"></i>
                            {course.totalSeats} students
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Carousel controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#courseCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#courseCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      image: "https://placehold.co/80x80/E0E7FF/000000?text=LA", // Placeholder for Leslie Alexander
      name: "Leslie Alexander",
      title: "CEO, Parkview Int.Ltd",
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour",
      rating: 5,
    },
    {
      id: 2,
      image: "https://placehold.co/80x80/ADD8E6/000000?text=CF", // Placeholder for Cody Fisher
      name: "Cody Fisher",
      title: "CEO, Parkview Int.Ltd",
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour",
      rating: 4.5,
    },
    {
      id: 3,
      image: "https://placehold.co/80x80/87CEEB/000000?text=RF", // Placeholder for Robert Fox
      name: "Robert Fox",
      title: "CEO, Parkview Int.Ltd",
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour",
      rating: 4,
    },
  ];

  return (
    <section className="container py-5" id="testimonial-section">
      <h2 className="fw-bolder text-center mb-5">What our students say.</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
        {testimonialsData.map((testimonial) => (
          <div className="col" key={testimonial.id}>
            <div className="card h-100 shadow-sm rounded-4 border-0 p-4">
              <div className="card-body d-flex flex-column align-items-center text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <p className="card-text text-muted mb-3">{testimonial.text}</p>
                <h5 className="card-title fw-bold mb-2">{testimonial.name}</h5>
                <p className="card-subtitle text-muted mb-2" style={{ fontSize: '0.9rem' }}>{testimonial.title}</p>
                <div className="d-flex justify-content-center">
                  {renderStars(testimonial.rating)} {/* Using the shared renderStars */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <section className="container py-5">
      <div
        className="d-flex flex-column align-items-center justify-content-center text-white rounded-4 shadow-lg p-5 mx-auto"
        style={{
          background: 'linear-gradient(to right, #4a90e2, #6c63ff)', // Gradient colors from image
          maxWidth: '900px',
          minHeight: '250px',
          transform: 'skewY(-3deg)', // Apply the skew effect
          marginTop: '50px', // Adjust margin to fit the design
          marginBottom: '50px',
        }}
      >
        <div style={{ transform: 'skewY(3deg)', textAlign: 'center' }}> {/* Counter-skew content */}
          <h1 className="fw-bolder mb-3">Newsletter.</h1>
          <p className="mb-4 fs-6 text-opacity-75 h3">
            Subscribe our newsletter for discounts, promo and many more.
          </p>
          <div className="input-group mb-3 rounded-pill overflow-hidden" style={{ maxWidth: '500px' }}>
            <input
              type="email"
              className="form-control border-0 py-3 px-4 rounded-pill"
              placeholder="Enter your email address"
              aria-label="Enter your email address"
              style={{ paddingRight: '15px' }} // Adjust padding for inner text
            />
            {/* The image doesn't show a button, so we'll just have the input field */}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-info bg-opacity-10 py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand and Social Icons */}
          <div className="col-md-3 mb-4 mb-md-0">
            <a className="navbar-brand d-flex align-items-center mb-3" href="#">
              <span className="fs-4 fw-bold text-dark">CAMS</span>
              <span className="ms-2" style={{ width: '8px', height: '8px', backgroundColor: '#6c63ff', borderRadius: '50%' }}></span>
            </a>
            <div className="d-flex fs-5">
              <a href="#" className="text-dark me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-dark me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-dark"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* Links Section */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Home</a></li>
              <li className="mb-2"><a href="#course-section" className="text-muted text-decoration-none">Courses</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Mentor</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Group</a></li>
              <li className="mb-2"><a href="#testimonial-section" className="text-muted text-decoration-none">Testimonial</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Docs</a></li>
            </ul>
          </div>

          {/* Other Section */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Other</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">About Us</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Our Team</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Career</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Services</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="col-md-5">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="d-flex align-items-start mb-2">
                <i className="bi bi-geo-alt-fill text-primary me-2 mt-1"></i>
                <span className="text-muted">#123 Street</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone-fill text-primary me-2"></i>
                <span className="text-muted">+91 11111-11111</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope-fill text-primary me-2"></i>
                <span className="text-muted">info@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        {/* Copyright and Bottom Links */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted" style={{ fontSize: '0.9rem' }}>
          <span>&copy;2025 Agency. All Rights Reserved by CAMS Group.</span>
          <div className="d-flex mt-2 mt-md-0">
            <a href="#" className="text-muted text-decoration-none me-3">Privacy policy</a>
            <a href="#" className="text-muted text-decoration-none">Terms & conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Home Component (with dynamic sticky header logic)
export default function Home() {


  return (
    <div className='bg-light min-vh-100'>
      <Header title="CAMS"/>
      <Hero />
      <CourseDisplay />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
