import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const CourseCard = ({ course, hideViewButton }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewCourse = () => {
    if (user) {
      navigate(`/courses/${course.id}`);
    } else {
      navigate('/login');
    }
  };

  const renderStars = () => {
    const stars = [];
    const rating = course.rating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-500" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FontAwesomeIcon key={5-i} icon={faStar} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-32 sm:h-44 object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-2">By {course.author}</p>
        <p className="text-gray-700 text-sm flex-grow line-clamp-3 mb-4">
          {course.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {renderStars()}
          </div>
          <span className="text-gray-600 text-sm ml-2">{course.rating ? course.rating.toFixed(1) : 'N/A'}</span>
        </div>

        {/* Button */}
        {!hideViewButton && (
          <button
            onClick={handleViewCourse}
            className="mt-auto bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            View Course
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
