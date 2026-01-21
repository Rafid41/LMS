import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import users from '../data/users.json';

const Profile = () => {
  const { user } = useAuth();
  // In a real app, you'd fetch the user's full profile based on the logged-in user's ID.
  // For this example, we'll find the user in the users.json file.
  const userProfile = users.students.find(u => u.email === user.email);

  if (!userProfile) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <img 
            src="/assets/images/profile_image/default_profile_img.png" 
            alt="Profile" 
            className="h-40 w-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800">{userProfile.name}</h1>
            <p className="text-lg text-gray-500 mt-1">{userProfile.email}</p>
            <p className="text-md text-gray-700 mt-4 max-w-prose">{userProfile.bio}</p>
          </div>
        </div>

        <div className="mt-10 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-600">Date of Birth</p>
              <p className="text-gray-800">{userProfile.dateOfBirth}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-600">Enrolled Courses</p>
              <ul className="list-disc list-inside text-gray-800">
                {userProfile.enrolledCourses.map(course => <li key={course}>{course}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
