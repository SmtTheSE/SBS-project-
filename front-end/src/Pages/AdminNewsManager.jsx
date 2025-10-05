import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import Container from "../Components/Container";
import SubContainer from "../Components/SubContainer";

const AdminNewsManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    newsId: "",
    adminId: "",
    title: "",
    description: "",
    imageUrl: "",
    newsType: "",
    publishDate: "",
    active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("/news");
      setNewsList(response.data);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Failed to fetch news");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async (newsId) => {
    if (!imageFile) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(imageFile.type)) {
      setError("Only JPG, PNG, GIF files allowed");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await axios.post(`/news/${newsId}/update-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update the news list with the new image URL
      setNewsList(newsList.map(news => 
        news.newsId === newsId 
          ? { ...news, imageUrl: response.data.imageUrl } 
          : news
      ));
      
      // Also update form data if we're editing this news
      if (formData.newsId === newsId) {
        setFormData({ ...formData, imageUrl: response.data.imageUrl });
      }
      
      setImageFile(null);
      setError("");
    } catch (err) {
      console.error("Failed to upload image:", err);
      setError(`Failed to upload image: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure required fields are provided
      if (!formData.title || !formData.adminId) {
        setError("Title and Admin ID are required");
        return;
      }
      
      const newsData = {
        ...formData,
        // Ensure boolean values are properly set
        active: Boolean(formData.active)
      };
      
      let response;
      if (isEditing) {
        response = await axios.put(`/news/${formData.newsId}`, newsData);
      } else {
        response = await axios.post("/news", newsData);
      }
      
      // If we have an image file, upload it
      if (imageFile && response.data && response.data.newsId) {
        await handleImageUpload(response.data.newsId);
      }
      
      fetchNews();
      resetForm();
    } catch (err) {
      console.error("Failed to save news:", err);
      setError(`Failed to save news: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleEdit = (news) => {
    setFormData({ ...news });
    setIsEditing(true);
    setImageFile(null);
  };

  const handleDelete = async (newsId) => {
    try {
      await axios.delete(`/news/${newsId}`);
      fetchNews();
    } catch (err) {
      console.error("Failed to delete news:", err);
      setError("Failed to delete news");
    }
  };

  const resetForm = () => {
    setFormData({
      newsId: "",
      adminId: "",
      title: "",
      description: "",
      imageUrl: "",
      newsType: "",
      publishDate: "",
      active: true,
    });
    setIsEditing(false);
    setImageFile(null);
  };

  return (
    <section>
      <Container>
        <SubContainer>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">News Management</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* News Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isEditing ? "Edit News" : "Add New News"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 mb-1">
                      Admin ID
                    </label>
                    <input
                      type="text"
                      id="adminId"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newsType" className="block text-sm font-medium text-gray-700 mb-1">
                      News Type
                    </label>
                    <input
                      type="text"
                      id="newsType"
                      name="newsType"
                      value={formData.newsType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      id="publishDate"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {imageFile && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected file: {imageFile.name}</p>
                        {isEditing && formData.newsId && (
                          <button
                            type="button"
                            onClick={() => handleImageUpload(formData.newsId)}
                            disabled={uploading}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                          >
                            {uploading ? "Uploading..." : "Upload Image"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isEditing ? "Update News" : "Add News"}
                  </button>
                </div>
              </form>
            </div>

            {/* News List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">News List</h2>
              {newsList.length === 0 ? (
                <p className="text-gray-500">No news found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Publish Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Active
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newsList.map((news) => (
                        <tr key={news.newsId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{news.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{news.newsType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{news.publishDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${news.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {news.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(news)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(news.newsId)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </SubContainer>
      </Container>
    </section>
  );
};

export default AdminNewsManager;