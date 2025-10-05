import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormButton } from '../Components/ModernForm';

const AdminVisaExtensionRequestManager = () => {
  const [extensionRequests, setExtensionRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExtensionRequests();
  }, []);

  const fetchExtensionRequests = async () => {
    try {
      const response = await axiosInstance.get('/visa-extension-requests');
      setExtensionRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch visa extension requests:', error);
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const request = extensionRequests.find(req => req.extensionRequestId === requestId);
      await axiosInstance.put(`/visa-extension-requests/${requestId}`, {
        ...request,
        status: status
      });
      
      // Update local state
      setExtensionRequests(prev => 
        prev.map(req => 
          req.extensionRequestId === requestId 
            ? { ...req, status: status } 
            : req
        )
      );
      
      alert('Request status updated successfully!');
    } catch (error) {
      console.error('Failed to update request status:', error);
      alert('Failed to update request status');
    }
  };

  // Function to delete a specific request
  const deleteRequest = async (requestId) => {
    try {
      // Confirm with admin before deletion
      const confirmDelete = window.confirm('Are you sure you want to delete this request? This action cannot be undone.');
      if (!confirmDelete) return;

      // Delete the request
      await axiosInstance.delete(`/visa-extension-requests/${requestId}`);
      
      // Update local state to remove the deleted request
      setExtensionRequests(prev => prev.filter(req => req.extensionRequestId !== requestId));
      
      alert('Request deleted successfully!');
    } catch (error) {
      console.error('Failed to delete request:', error);
      alert('Failed to delete request');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Visa Extension Requests</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Visa Extension Requests</h1>
            <p className="text-gray-600">
              Manage student visa extension requests • Total: {extensionRequests.length}
            </p>
          </div>
        </div>

        {extensionRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No visa extension requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visa Passport ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Extension Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {extensionRequests.map((request) => (
                  <tr key={request.extensionRequestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.extensionRequestId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.visaPassportId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.requestDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.requestedExtensionUntil}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.notes || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 0 && ( // Only show approve/reject for pending requests
                        <>
                          <FormButton
                            type="button"
                            variant="success"
                            onClick={() => updateRequestStatus(request.extensionRequestId, 1)}
                            className="mr-2"
                          >
                            Approve
                          </FormButton>
                          <FormButton
                            type="button"
                            variant="danger"
                            onClick={() => updateRequestStatus(request.extensionRequestId, 2)}
                            className="mr-2"
                          >
                            Reject
                          </FormButton>
                        </>
                      )}
                      <FormButton
                        type="button"
                        variant="secondary"
                        onClick={() => deleteRequest(request.extensionRequestId)}
                      >
                        Delete
                      </FormButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVisaExtensionRequestManager;