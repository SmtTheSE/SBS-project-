import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';

const AdminClassScheduleManager = () => {
  const [classSchedules, setClassSchedules] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClassSchedule, setCurrentClassSchedule] = useState({
    classScheduleId: '',
    studyPlanCourseId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
    room: ''
  });


  const fetchClassSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/class-schedules');
      setClassSchedules(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch class schedules:', err);
      setError('Failed to fetch class schedules: ' + (err.response?.data?.message || err.message));
      setClassSchedules([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchStudyPlanCourses = async () => {
    try {
      const response = await axios.get('/academic/study-plan-courses');
      setStudyPlanCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch study plan courses:', err);
    }
  };

  useEffect(() => {
    fetchClassSchedules();
    fetchStudyPlanCourses();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClassSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const openAddModal = () => {
    setIsEditing(false);
    setCurrentClassSchedule({
      classScheduleId: '',
      studyPlanCourseId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      durationMinutes: '',
      room: ''
    });
    setShowModal(true);
  };


  const openEditModal = (classSchedule) => {
    setIsEditing(true);
    setCurrentClassSchedule({
      classScheduleId: classSchedule.classScheduleId,
      studyPlanCourseId: classSchedule.studyPlanCourseId,
      dayOfWeek: classSchedule.dayOfWeek,
      startTime: classSchedule.startTime,
      endTime: classSchedule.endTime,
      durationMinutes: classSchedule.durationMinutes,
      room: classSchedule.room
    });
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const classScheduleData = {
        ...currentClassSchedule,
        durationMinutes: parseInt(currentClassSchedule.durationMinutes) || 0
      };

      if (isEditing) {

        await axios.put(`/admin/academic/class-schedules/${currentClassSchedule.classScheduleId}`, classScheduleData);
      } else {

        await axios.post('/admin/academic/class-schedules', classScheduleData);
      }
      closeModal();
      fetchClassSchedules();
      setError('');
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };


  const handleDelete = async (classScheduleId) => {
    if (window.confirm('Are you sure you want to delete this class schedule?')) {
      try {
        await axios.delete(`/admin/academic/class-schedules/${classScheduleId}`);
        fetchClassSchedules();
        setError('');
      } catch (err) {
        console.error('Delete failed:', err);
        setError('Delete failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Schedule Management</h1>
          <p className="text-gray-600 mb-6">
            Manage class schedule definitions
          </p>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Class Schedule Management</h1>
            <p className="text-gray-600">
              Manage class schedule definitions • Total: {classSchedules.length}
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Class Schedule
          </FormButton>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Plan Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day of Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration (min)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(classSchedules) && classSchedules.length > 0 ? (
                classSchedules.map((classSchedule) => (
                  <tr key={classSchedule.classScheduleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {classSchedule.classScheduleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.studyPlanCourseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.dayOfWeek}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.durationMinutes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(classSchedule)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(classSchedule.classScheduleId)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 text-lg">No class schedules found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Edit Class Schedule' : 'Add New Class Schedule'}
                  </h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <ModernForm onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormLabel required>Schedule ID</FormLabel>
                    <FormInput
                      type="text"
                      id="classScheduleId"
                      name="classScheduleId"
                      value={currentClassSchedule.classScheduleId}
                      onChange={handleInputChange}
                      required
                      disabled={isEditing}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Study Plan Course</FormLabel>
                    <FormSelect
                      id="studyPlanCourseId"
                      name="studyPlanCourseId"
                      value={currentClassSchedule.studyPlanCourseId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a Study Plan Course</option>
                      {studyPlanCourses.map(course => (
                        <option key={course.studyPlanCourseId} value={course.studyPlanCourseId}>
                          {course.studyPlanCourseId}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Day of Week</FormLabel>
                    <FormSelect
                      id="dayOfWeek"
                      name="dayOfWeek"
                      value={currentClassSchedule.dayOfWeek}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a Day</option>
                      <option value="Mon">Monday</option>
                      <option value="Tue">Tuesday</option>
                      <option value="Wed">Wednesday</option>
                      <option value="Thu">Thursday</option>
                      <option value="Fri">Friday</option>
                      <option value="Sat">Saturday</option>
                      <option value="Sun">Sunday</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Start Time</FormLabel>
                      <FormInput
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={currentClassSchedule.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>End Time</FormLabel>
                      <FormInput
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={currentClassSchedule.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Duration (Minutes)</FormLabel>
                      <FormInput
                        type="number"
                        id="durationMinutes"
                        name="durationMinutes"
                        value={currentClassSchedule.durationMinutes}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Room</FormLabel>
                      <FormInput
                        type="text"
                        id="room"
                        name="room"
                        value={currentClassSchedule.room}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </FormButton>
                    <FormButton
                      type="submit"
                      variant="success"
                    >
                      {isEditing ? 'Update' : 'Create'}
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClassScheduleManager;