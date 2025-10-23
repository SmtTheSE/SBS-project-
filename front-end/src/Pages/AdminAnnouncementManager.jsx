import React, { useState, useEffect } from 'react';
import { Upload, Edit, Save, X, Eye, EyeOff, Plus, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminAnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    announcementId: '',
    adminId: 'ADM001',
    title: '',
    announcementType: 'General',
    startDate: '',
    endDate: '',
    imageUrl: '',
    active: true,
  });
  const [createImageFile, setCreateImageFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%22400%22 height%3D%22300%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23cccccc%22/%3E%3Ctext x%3D%22200%22 y%3D%22150%22 font-family%3D%22Arial%2Csans-serif%22 font-size%3D%2220%22 fill%3D%22%23666666%22 text-anchor%3D%22middle%22 dominant-baseline%3D%22middle%22%3EImage%20Placeholder%3C/text%3E%3C/svg%3E';
  const errorImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%22400%22 height%3D%22300%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f8d7da%22/%3E%3Ctext x%3D%22200%22 y%3D%22150%22 font-family%3D%22Arial%2Csans-serif%22 font-size%3D%2220%22 fill%3D%22%23721c24%22 text-anchor%3D%22middle%22 dominant-baseline%3D%22middle%22%3EImage%20Error%3C/text%3E%3C/svg%3E';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  // Filter and search announcements
  const getFilteredAnnouncements = () => {
    return announcements.filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'All' || announcement.announcementType === filterType;
      return matchesSearch && matchesFilter;
    });
  };

  // Get current announcements for pagination
  const getCurrentAnnouncements = () => {
    const filteredAnnouncements = getFilteredAnnouncements();
    const indexOfLastAnnouncement = currentPage * itemsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - itemsPerPage;
    return filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Next page
  const nextPage = () => {
    const filteredAnnouncements = getFilteredAnnouncements();
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const createNewAnnouncement = async () => {
    if (!createData.title || !createData.startDate || !createData.endDate) {
      alert('Please fill in title, start date, and end date');
      return;
    }

    if (new Date(createData.startDate) > new Date(createData.endDate)) {
      alert('Start date cannot be later than end date');
      return;
    }

    if (createImageFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(createImageFile.type)) {
        alert('Only JPG, PNG, and GIF files are allowed');
        return;
      }
      if (createImageFile.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB');
        return;
      }
    }

    setCreating(true);
    try {
      let imageUrl = '';
      if (createImageFile) {
        const formData = new FormData();
        formData.append('file', createImageFile);

        const uploadResponse = await fetch('http://localhost:8080/api/announcements/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl;
        } else {
          const errorText = await uploadResponse.text();
          console.error('Image upload failed:', errorText);
          alert('Failed to upload image: ' + errorText);
          setCreating(false);
          return;
        }
      }


      const newId = createData.announcementId || `ANN${Date.now()}`;


      const announcementData = {
        announcementId: newId,
        adminId: createData.adminId,
        title: createData.title.trim(),
        announcementType: createData.announcementType,
        startDate: createData.startDate,
        endDate: createData.endDate,
        imageUrl: imageUrl,
        active: true,
        createdAt: null,
        updatedAt: null
      };

      console.log('Sending data to backend:', announcementData);
      console.log('JSON stringified data:', JSON.stringify(announcementData, null, 2));

      const response = await fetch('http://localhost:8080/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get the actual error message from response
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        // Parse response as JSON since it was successful
        const result = JSON.parse(responseText);
        console.log('Create success:', result);
        await fetchAnnouncements();
        setCurrentPage(1); // Reset to first page
        setShowCreateForm(false);
        setCreateData({
          announcementId: '',
          adminId: 'ADM001',
          title: '',
          announcementType: 'General',
          startDate: '',
          endDate: '',
          imageUrl: '',
          active: true, // Now matches DTO field name
        });
        setCreateImageFile(null);
        alert('Announcement created successfully!');
      } else {
        console.error('Create failed with status:', response.status);
        console.error('Error response:', responseText);
        alert('Failed to create announcement: ' + responseText);
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Network error occurred while creating announcement');
    } finally {
      setCreating(false);
    }
  };

  const saveEdit = async () => {
    try {
      const announcement = announcements.find(a => a.announcementId === editingId);

      const updateData = {
        announcementId: editingId,
        adminId: announcement.admin?.adminId || 'ADM001',
        title: editData.title || announcement.title,
        announcementType: editData.announcementType || announcement.announcementType,
        startDate: editData.startDate || announcement.startDate,
        endDate: editData.endDate || announcement.endDate,
        imageUrl: announcement.imageUrl,
        active: announcement.active,
      };

      const response = await fetch(`http://localhost:8080/api/announcements/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchAnnouncements();
        setEditingId(null);
        alert('Announcement updated!');
      } else {
        const errorText = await response.text();
        console.error('Update failed:', errorText);
        alert('Failed to update announcement: ' + errorText);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updating announcement');
    }
  };

  const toggleActive = async (announcement) => {
    try {
      const updateData = {
        announcementId: announcement.announcementId,
        adminId: announcement.admin?.adminId || 'ADM001',
        title: announcement.title,
        announcementType: announcement.announcementType,
        startDate: announcement.startDate,
        endDate: announcement.endDate,
        imageUrl: announcement.imageUrl,
        active: !announcement.active, // Now matches DTO field name
      };

      const response = await fetch(`http://localhost:8080/api/announcements/${announcement.announcementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchAnnouncements();
      } else {
        const errorText = await response.text();
        console.error('Toggle failed:', errorText);
        alert('Failed to update announcement status: ' + errorText);
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Network error occurred while toggling announcement');
    }
  };

  const handleImageUpload = async (announcementId, file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, and GIF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploadingId(announcementId);

    try {
      const uploadResponse = await fetch('http://localhost:8080/api/announcements/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        const announcement = announcements.find(a => a.announcementId === announcementId);

        const updateData = {
          announcementId: announcement.announcementId,
          adminId: announcement.admin?.adminId || 'ADM001',
          title: announcement.title,
          announcementType: announcement.announcementType,
          startDate: announcement.startDate,
          endDate: announcement.endDate,
          imageUrl: uploadResult.imageUrl,
          active: announcement.active, // Now matches DTO field name
        };

        const updateResponse = await fetch(`http://localhost:8080/api/announcements/${announcementId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });

        if (updateResponse.ok) {
          await fetchAnnouncements();
          alert('Image uploaded successfully!');
        } else {
          const errorText = await updateResponse.text();
          console.error('Update failed:', errorText);
          alert('Failed to update announcement: ' + errorText);
        }
      } else {
        const error = await uploadResponse.text();
        console.error('Upload failed:', error);
        alert('Upload failed: ' + error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: Network error');
    } finally {
      setUploadingId(null);
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/announcements/${announcementToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchAnnouncements();
        // If we're on the last page and it becomes empty, go to previous page
        const filteredAnnouncements = getFilteredAnnouncements();
        const totalPages = Math.ceil((filteredAnnouncements.length - 1) / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        alert('Announcement deleted successfully!');
      } else {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        alert('Failed to delete announcement: ' + errorText);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting announcement');
    } finally {
      setShowConfirmDialog(false);
      setAnnouncementToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setAnnouncementToDelete(null);
  };

  // Get current announcements
  const currentAnnouncements = getCurrentAnnouncements();
  const filteredAnnouncements = getFilteredAnnouncements();
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Panel - Announcements
            </h1>
            <p className="text-gray-600 text-sm">
              Create and manage announcements for 500+ students • Total: {announcements.length}
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md text-sm"
          >
            <Plus size={16} />
            {showCreateForm ? 'Cancel' : 'Create New'}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search announcements by title..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="block w-full sm:w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="All">All Types</option>
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Emergency">Emergency</option>
              <option value="Sports">Sports</option>
              <option value="System">System</option>
              <option value="Finance">Finance</option>
            </select>
            
            {(searchTerm || filterType !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('All');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Create New Announcement Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Create New Announcement</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Announcement Title *</label>
                  <input
                    type="text"
                    value={createData.title}
                    onChange={(e) => setCreateData({...createData, title: e.target.value})}
                    className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="e.g., Sports Day 2025, Exam Schedule Update..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type *</label>
                  <select
                    value={createData.announcementType}
                    onChange={(e) => setCreateData({...createData, announcementType: e.target.value})}
                    className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Sports">Sports</option>
                    <option value="System">System</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={createData.startDate}
                      onChange={(e) => setCreateData({...createData, startDate: e.target.value})}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      value={createData.endDate}
                      onChange={(e) => setCreateData({...createData, endDate: e.target.value})}
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Announcement ID</label>
                  <input
                    type="text"
                    value={createData.announcementId}
                    onChange={(e) => setCreateData({...createData, announcementId: e.target.value})}
                    className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Leave empty for auto-generation or enter custom ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: Will auto-generate if empty</p>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Announcement Image</label>

                {createImageFile ? (
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-2 border-2 border-green-300">
                    <img
                      src={URL.createObjectURL(createImageFile)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = errorImage;
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Upload size={36} className="text-gray-400 mx-auto mb-1" />
                      <span className="text-gray-400 text-sm">No image selected</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCreateImageFile(e.target.files[0])}
                  className="hidden"
                  id="create-image-upload"
                />
                <label
                  htmlFor="create-image-upload"
                  className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors w-full justify-center text-sm"
                >
                  <Upload size={16} className="text-blue-500" />
                  <span className="text-blue-600 font-medium">
                    {createImageFile ? 'Change Image' : 'Select Image from Computer'}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF • Max 5MB • Optional (students will see placeholder if no image)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-3 border-t">
              <button
                onClick={createNewAnnouncement}
                disabled={creating}
                className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
              >
                <Save size={16} />
                {creating ? 'Creating...' : 'Create Announcement'}
              </button>

              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateData({
                    announcementId: '',
                    adminId: 'ADM001',
                    title: '',
                    announcementType: 'General',
                    startDate: '',
                    endDate: '',
                    imageUrl: '',
                    active: true, // Now matches DTO field name
                  });
                  setCreateImageFile(null);
                }}
                className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing Announcements Management */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">
            Existing Announcements ({filteredAnnouncements.length})
          </h2>

          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {searchTerm || filterType !== 'All' 
                  ? 'No announcements match your search/filter criteria' 
                  : 'No announcements yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || filterType !== 'All'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Click "Create New" to add your first announcement'}
              </p>
            </div>
          ) : (
            <>
              {currentAnnouncements.map((announcement) => (
                <div
                  key={announcement.announcementId}
                  className={`border rounded-lg p-4 transition-all ${
                    announcement.active
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-100'
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        announcement.active
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {announcement.announcementId}
                      </span>

                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {announcement.announcementType}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleActive(announcement)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors font-medium text-xs ${
                          announcement.active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {announcement.active ? <EyeOff size={12} /> : <Eye size={12} />}
                        {announcement.active ? 'Hide' : 'Show'}
                      </button>

                      {editingId === announcement.announcementId ? (
                        <>
                          <button onClick={saveEdit} className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <Save size={12} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => {
                          setEditingId(announcement.announcementId);
                          setEditData({
                            title: announcement.title,
                            announcementType: announcement.announcementType,
                            startDate: announcement.startDate,
                            endDate: announcement.endDate,
                          });
                        }} className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          <Edit size={12} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteAnnouncement(announcement.announcementId)}
                        className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Image Section */}
                    <div>
                      <h4 className="font-bold text-gray-700 text-sm mb-1">Image:</h4>
                      <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden mb-2">
                        <img
                          src={announcement.imageUrl || placeholderImage}
                          alt={announcement.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = errorImage;
                          }}
                        />
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                            if (!allowedTypes.includes(file.type)) {
                              alert('Only JPG, PNG, and GIF files are allowed');
                              return;
                            }

                            if (file.size > 5 * 1024 * 1024) {
                              alert('File size exceeds 5MB');
                              return;
                            }

                            handleImageUpload(announcement.announcementId, file);
                          }
                        }}
                        className="hidden"
                        id={`upload-${announcement.announcementId}`}
                        disabled={uploadingId === announcement.announcementId}
                      />
                      <label
                        htmlFor={`upload-${announcement.announcementId}`}
                        className={`flex items-center gap-1 px-2 py-1 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors w-full justify-center text-xs ${
                          uploadingId === announcement.announcementId ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload size={12} className="text-orange-500" />
                        <span className="text-orange-600 font-medium">
                          {uploadingId === announcement.announcementId ? 'Uploading...' : 'Update'}
                        </span>
                      </label>
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-3">
                      <h4 className="font-bold text-gray-700 text-sm mb-2">Details:</h4>

                      {editingId === announcement.announcementId ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Title:</label>
                            <input
                              type="text"
                              value={editData.title || ''}
                              onChange={(e) => setEditData({...editData, title: e.target.value})}
                              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Type:</label>
                              <select
                                value={editData.announcementType || ''}
                                onChange={(e) => setEditData({...editData, announcementType: e.target.value})}
                                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                <option value="General">General</option>
                                <option value="Academic">Academic</option>
                                <option value="Event">Event</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Sports">Sports</option>
                                <option value="System">System</option>
                                <option value="Finance">Finance</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date:</label>
                              <input
                                type="date"
                                value={editData.startDate || ''}
                                onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">End Date:</label>
                              <input
                                type="date"
                                value={editData.endDate || ''}
                                onChange={(e) => setEditData({...editData, endDate: e.target.value})}
                                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <span className="font-bold text-gray-700 text-sm">Title:</span>
                            <p className="text-gray-800 font-medium">{announcement.title}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="font-bold text-gray-700 text-sm">Duration:</span>
                              <p className="text-gray-600 text-sm">{announcement.startDate} → {announcement.endDate}</p>
                            </div>
                            <div>
                              <span className="font-bold text-gray-700 text-sm">Last Updated:</span>
                              <p className="text-gray-600 text-sm">{announcement.updatedAt}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      <span className="ml-1">Previous</span>
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`w-10 h-10 rounded-full ${
                            currentPage === pageNumber
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentPage === totalPages 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Announcement"
          message="Are you sure you want to delete this announcement? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminAnnouncementManager;