import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <div className="max-w-7xl mx-auto p-6">
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transcript Request Management</h1>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <button 
              onClick={fetchTranscriptRequests}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Transcript Request Management</h1>
        <p className="text-gray-600 mb-6">
          Manage student transcript requests
        </p>
        
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No transcript requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Request ID</th>
                  <th className="py-2 px-4 border-b text-left">Student ID</th>
                  <th className="py-2 px-4 border-b text-left">Student Name</th>
                  <th className="py-2 px-4 border-b text-left">Type</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Message</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{request.request?.requestId || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{request.student?.studentId || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {request.student?.firstName || ''} {request.student?.lastName || ''}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {request.request?.transcriptType === 0 ? 'Unofficial' : 
                       request.request?.transcriptType === 1 ? 'Official' : 'Unknown'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {request.request?.requestDate ? new Date(request.request.requestDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.requestStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.requestStatus === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        request.requestStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                        request.requestStatus === 'Issued' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.requestStatus}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">{request.optionalMessage || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {request.requestStatus === 'Pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateRequestStatus(request.id, 'Approved')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'Rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {request.requestStatus === 'Approved' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'Issued')}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Mark as Issued
                        </button>
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