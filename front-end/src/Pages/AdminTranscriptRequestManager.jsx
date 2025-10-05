import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernForm, FormButton } from '../Components/ModernForm';

const AdminTranscriptRequestManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTranscriptRequests();
  }, []);

  const fetchTranscriptRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/academic/transcript-requests/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        setError('Failed to fetch transcript requests');
      }
    } catch (err) {
      setError('Error fetching transcript requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8080/api/academic/transcript-requests/${requestId}/status?status=${status}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Update the local state
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, requestStatus: status } : req
        ));
      } else {
        setError('Failed to update request status');
      }
    } catch (err) {
      setError('Error updating request status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transcript Request Management</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading transcript requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transcript Request Management</h1>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <FormButton 
              variant="primary"
              onClick={fetchTranscriptRequests}
              className="mt-4"
            >
              Retry
            </FormButton>
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
            <h1 className="text-3xl font-bold text-gray-800">Transcript Request Management</h1>
            <p className="text-gray-600">
              Manage student transcript requests • Total: {requests.length}
            </p>
          </div>
        </div>
        
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No transcript requests found</p>
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
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.request?.requestId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.student?.studentId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.student?.firstName || ''} {request.student?.lastName || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.request?.transcriptType === 0 ? 'Unofficial' : 
                       request.request?.transcriptType === 1 ? 'Official' : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.request?.requestDate ? new Date(request.request.requestDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.requestStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.requestStatus === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        request.requestStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                        request.requestStatus === 'Issued' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.requestStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.optionalMessage || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.requestStatus === 'Pending' && (
                        <div className="flex space-x-2">
                          <FormButton
                            variant="success"
                            onClick={() => updateRequestStatus(request.id, 'Approved')}
                            className="mr-2"
                          >
                            Approve
                          </FormButton>
                          <FormButton
                            variant="danger"
                            onClick={() => updateRequestStatus(request.id, 'Rejected')}
                          >
                            Reject
                          </FormButton>
                        </div>
                      )}
                      {request.requestStatus === 'Approved' && (
                        <FormButton
                          variant="primary"
                          onClick={() => updateRequestStatus(request.id, 'Issued')}
                        >
                          Mark as Issued
                        </FormButton>
                      )}
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

export default AdminTranscriptRequestManager;