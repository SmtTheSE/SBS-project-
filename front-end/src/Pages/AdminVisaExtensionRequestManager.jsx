import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

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
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Visa Extension Requests</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Visa Extension Requests</h1>
        <p className="text-gray-600 mb-6">
          Manage student visa extension requests • Total: {extensionRequests.length}
        </p>

        {extensionRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No visa extension requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left">Request ID</th>
                  <th className="py-3 px-4 border-b text-left">Student ID</th>
                  <th className="py-3 px-4 border-b text-left">Visa Passport ID</th>
                  <th className="py-3 px-4 border-b text-left">Request Date</th>
                  <th className="py-3 px-4 border-b text-left">Requested Extension Until</th>
                  <th className="py-3 px-4 border-b text-left">Status</th>
                  <th className="py-3 px-4 border-b text-left">Notes</th>
                  <th className="py-3 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {extensionRequests.map((request) => (
                  <tr key={request.extensionRequestId} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{request.extensionRequestId}</td>
                    <td className="py-3 px-4 border-b">{request.studentId}</td>
                    <td className="py-3 px-4 border-b">{request.visaPassportId}</td>
                    <td className="py-3 px-4 border-b">{request.requestDate}</td>
                    <td className="py-3 px-4 border-b">{request.requestedExtensionUntil}</td>
                    <td className="py-3 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">{request.notes || 'N/A'}</td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex space-x-2">
                        {request.status === 0 && ( // Only show approve/reject for pending requests
                          <>
                            <button
                              onClick={() => updateRequestStatus(request.extensionRequestId, 1)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.extensionRequestId, 2)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteRequest(request.extensionRequestId)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
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