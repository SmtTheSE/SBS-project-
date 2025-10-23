import React, { useEffect, useState, useMemo } from "react";
import Container from "../Components/Container";
import SubContainer from "../Components/SubContainer";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Search, Filter, X } from 'lucide-react';
import ModernDropdown from "../Components/ModernDropdown";

const VisaPassport = () => {
  const [visaPassports, setVisaPassports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('visaPassportId');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    visaId: '',
    passportNumber: '',
    visaType: '',
    dateFrom: '',
    dateTo: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axiosInstance.get("/profile")
      .then((res) => {
        const studentId = res.data.studentId;
        setStudentId(studentId);
        fetchVisaPassportData(studentId, token);
      })
      .catch(() => navigate("/login"));
  }, []);

  const fetchVisaPassportData = async (studentId, token) => {
    try {
      const response = await axiosInstance.get(
        `/visa-passports/student/${studentId}`
      );

      setVisaPassports(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch visa passport data:", err);
      setError("Failed to load visa/passport information");
      setLoading(false);
    }
  };

  // 处理搜索输入变化
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 处理类型过滤变化
  const handleTypeFilterChange = (value) => {
    setFilterType(value);
  };

  // 处理排序字段变化
  const handleSortByChange = (value) => {
    setSortBy(value);
  };

  // 处理排序顺序变化
  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  // 处理高级过滤器变化
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 清除所有过滤器
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setSortBy('visaPassportId');
    setSortOrder('asc');
    setFilters({
      visaId: '',
      passportNumber: '',
      visaType: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  // 获取签证类型文本
  const getVisaTypeText = (visaType) => {
    return visaType === 1 ? 'Multiple Entry' : 'Single Entry';
  };

  // 过滤和排序逻辑
  const filteredAndSortedVisaPassports = useMemo(() => {
    let result = [...visaPassports];
    
    // 应用搜索过滤器
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(record => 
        record.visaPassportId.toLowerCase().includes(term) ||
        record.visaId.toLowerCase().includes(term) ||
        record.passportNumber.toLowerCase().includes(term)
      );
    }
    
    // 应用类型过滤器
    if (filterType !== 'All') {
      if (filterType === 'Single Entry') {
        result = result.filter(record => record.visaType === 0);
      } else if (filterType === 'Multiple Entry') {
        result = result.filter(record => record.visaType === 1);
      }
    }
    
    // 应用高级过滤器
    if (filters.visaId) {
      result = result.filter(record => 
        record.visaId.toLowerCase().includes(filters.visaId.toLowerCase())
      );
    }
    
    if (filters.passportNumber) {
      result = result.filter(record => 
        record.passportNumber.toLowerCase().includes(filters.passportNumber.toLowerCase())
      );
    }
    
    if (filters.visaType && filters.visaType !== 'All') {
      const visaTypeValue = filters.visaType === 'Single Entry' ? 0 : 1;
      result = result.filter(record => record.visaType === visaTypeValue);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(record => 
        new Date(record.visaIssuedDate) >= fromDate || new Date(record.passportIssuedDate) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter(record => 
        new Date(record.visaExpiredDate) <= toDate || new Date(record.passportExpiredDate) <= toDate
      );
    }
    
    // 应用排序
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'visaPassportId':
          aValue = a.visaPassportId;
          bValue = b.visaPassportId;
          break;
        case 'visaId':
          aValue = a.visaId;
          bValue = b.visaId;
          break;
        case 'visaExpiredDate':
          aValue = new Date(a.visaExpiredDate);
          bValue = new Date(b.visaExpiredDate);
          break;
        case 'passportNumber':
          aValue = a.passportNumber;
          bValue = b.passportNumber;
          break;
        case 'passportExpiredDate':
          aValue = new Date(a.passportExpiredDate);
          bValue = new Date(b.passportExpiredDate);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    return result;
  }, [visaPassports, searchTerm, filterType, sortBy, sortOrder, filters]);

  const handleRequestExtension = async (visaPassportId, studentId) => {
    // Confirm with user before sending request
    if (!window.confirm("Are you sure you want to request a visa extension?")) {
      return;
    }

    try {
      // Using the correct admin ID from the database
      const adminId = 'ADM001'; // Fixed the admin ID to match the database record
      
      // Generate a unique ID for the extension request (must be <= 15 characters to fit DB column)
      const extensionRequestId = 'VER' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3);
      
      const requestData = {
        extensionRequestId: extensionRequestId,
        visaPassportId: visaPassportId,
        studentId: studentId,
        adminId: adminId,
        requestDate: new Date().toISOString().split('T')[0],
        requestedExtensionUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0], // 3 months from now
        status: 0, // Pending
        notes: 'Visa extension request from student'
      };

      await axiosInstance.post('/visa-extension-requests', requestData);
      alert('Visa extension request sent successfully!');
      // Refresh the page to show updated information
      window.location.reload();
    } catch (error) {
      console.error('Failed to send visa extension request:', error);
      alert('Failed to send visa extension request: ' + (error.response?.data || error.message));
    }
  };

  if (loading) {
    return (
      <section className="p-10">
        <Container>
          <SubContainer>
            <div className="text-center py-10">
              <p>Loading visa/passport information...</p>
            </div>
          </SubContainer>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-10">
        <Container>
          <SubContainer>
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          </SubContainer>
        </Container>
      </section>
    );
  }

  // 类型过滤选项
  const typeFilterOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'Single Entry', label: 'Single Entry' },
    { value: 'Multiple Entry', label: 'Multiple Entry' }
  ];

  // 签证类型过滤选项
  const visaTypeOptions = [
    { value: '', label: 'Any Type' },
    { value: 'Single Entry', label: 'Single Entry' },
    { value: 'Multiple Entry', label: 'Multiple Entry' }
  ];

  // 排序字段选项
  const sortOptions = [
    { value: 'visaPassportId', label: 'Visa Passport ID' },
    { value: 'visaId', label: 'Visa ID' },
    { value: 'visaExpiredDate', label: 'Visa Expired Date' },
    { value: 'passportNumber', label: 'Passport Number' },
    { value: 'passportExpiredDate', label: 'Passport Expired Date' }
  ];

  // 排序顺序选项
  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];

  // 检查是否有任何过滤器被激活
  const hasActiveFilters = searchTerm || filterType !== 'All' || sortBy !== 'visaPassportId' || sortOrder !== 'asc' || 
    filters.visaId || filters.passportNumber || filters.visaType || filters.dateFrom || filters.dateTo;

  return (
    <section className="p-10">
      <Container>
        <SubContainer>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Visa/Passport Information</h1>
          <p className="text-gray-600 mb-8">
            View your visa and passport details
          </p>

          {/* Search and Filter Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by ID, Visa ID or Passport Number..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* Type Filter */}
              <div>
                <ModernDropdown
                  options={typeFilterOptions}
                  value={filterType}
                  onChange={handleTypeFilterChange}
                  placeholder="Filter by Type"
                />
              </div>
              
              {/* Sort By */}
              <div>
                <ModernDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={handleSortByChange}
                  placeholder="Sort by"
                />
              </div>
              
              {/* Sort Order */}
              <div>
                <ModernDropdown
                  options={sortOrderOptions}
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  placeholder="Sort order"
                />
              </div>
            </div>
            
            {/* Advanced Filters Toggle */}
            <details className="mt-4">
              <summary className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800">
                <Filter className="mr-2 h-4 w-4" />
                <span>Advanced Filters</span>
              </summary>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visa ID</label>
                  <input
                    type="text"
                    value={filters.visaId}
                    onChange={(e) => handleFilterChange('visaId', e.target.value)}
                    placeholder="Filter by Visa ID"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                  <input
                    type="text"
                    value={filters.passportNumber}
                    onChange={(e) => handleFilterChange('passportNumber', e.target.value)}
                    placeholder="Filter by Passport Number"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
                  <ModernDropdown
                    options={visaTypeOptions}
                    value={filters.visaType}
                    onChange={(value) => handleFilterChange('visaType', value)}
                    placeholder="Filter by Visa Type"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </details>
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  
                  {searchTerm && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: {searchTerm}
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filterType !== 'All' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Type: {filterType}
                      <button 
                        onClick={() => setFilterType('All')}
                        className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.visaId && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Visa ID: {filters.visaId}
                      <button 
                        onClick={() => handleFilterChange('visaId', '')}
                        className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.passportNumber && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Passport: {filters.passportNumber}
                      <button 
                        onClick={() => handleFilterChange('passportNumber', '')}
                        className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.visaType && filters.visaType !== 'All' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Visa Type: {filters.visaType}
                      <button 
                        onClick={() => handleFilterChange('visaType', '')}
                        className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.dateFrom && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      From: {filters.dateFrom}
                      <button 
                        onClick={() => handleFilterChange('dateFrom', '')}
                        className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.dateTo && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      To: {filters.dateTo}
                      <button 
                        onClick={() => handleFilterChange('dateTo', '')}
                        className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={clearFilters}
                    className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {filteredAndSortedVisaPassports.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {visaPassports.length === 0 
                  ? "No visa/passport records found" 
                  : "No visa/passport records match your search criteria"}
              </p>
              {(searchTerm || filterType !== 'All' || filters.visaId || filters.passportNumber || filters.visaType) && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search or filter criteria
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Visa Passport ID</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Visa ID</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Visa Dates</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Visa Type</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Passport Number</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Passport Dates</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedVisaPassports.map((record) => (
                    <tr key={record.visaPassportId} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{record.visaPassportId}</td>
                      <td className="py-3 px-4">{record.visaId}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span>Issued: {record.visaIssuedDate}</span>
                          <span>Expired: {record.visaExpiredDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getVisaTypeText(record.visaType)}</td>
                      <td className="py-3 px-4">{record.passportNumber}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span>Issued: {record.passportIssuedDate}</span>
                          <span>Expired: {record.passportExpiredDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => handleRequestExtension(record.visaPassportId, studentId)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium text-sm"
                        >
                          Request Extension
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SubContainer>
      </Container>
    </section>
  );
};

export default VisaPassport;