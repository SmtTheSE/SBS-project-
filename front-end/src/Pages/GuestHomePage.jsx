import React, { useEffect, useState } from "react";
import DropDowns from "../Components/DropDown";
import Container from "../Components/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GuestHomePage = () => {
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  // 分页状态
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [announcementsCurrentPage, setAnnouncementsCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每页显示的项目数
  const navigate = useNavigate();

  const [sampleNews] = useState([
    {
      id: 1,
      title: "Student Portal Maintenance",
      image:
        "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=800&q=80",
      detail: "System",
      duration: "July 7 to July 9, 2025",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate repudiandae vel doloribus! Ab dignissimos iusto repudiandae, unde ut quod eos quia atque molestias deleniti non amet voluptatum explicabo assumenda eaque!",
    },
    {
      id: 2,
      title: "Student Portal Maintenance",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      detail: "Emergency",
      duration: "July 7 to July 9, 2025",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate repudiandae vel doloribus! Ab dignissimos iusto repudiandae, unde ut quod eos quia atque molestias deleniti non amet voluptatum explicabo assumenda eaque!",
    },
  ]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/announcements/active"
      );
      // 确保数据是数组
      const data = Array.isArray(response.data) ? response.data : [];

      // Filter announcements for news section (System or Emergency type)
      const systemOrEmergencyAnnouncements = data.filter(a => 
        a.announcementType === "System" || a.announcementType === "Emergency"
      );

      // Filter announcements for announcements section (NOT System or Emergency type)
      const otherAnnouncements = data.filter(a => 
        a.announcementType !== "System" && a.announcementType !== "Emergency"
      );

      // Map all announcements
      const mappedAllAnnouncements = Array.isArray(otherAnnouncements) ? otherAnnouncements.map((a) => {
        return {
          id: a.announcementId || Date.now() + Math.random(), // 添加默认ID
          title: a.title || "Untitled Announcement",
          image: a.imageUrl || "https://via.placeholder.com/300x200?text=No+Image",
          detail: a.announcementType || "General",
          duration: `${a.startDate || "N/A"} to ${a.endDate || "N/A"}`,
          description: a.description || "No description available",
        };
      }) : [];

      // Map announcements for news section
      const mappedNews = Array.isArray(systemOrEmergencyAnnouncements) ? systemOrEmergencyAnnouncements.map((a) => {
        return {
          id: a.announcementId || Date.now() + Math.random(), // 添加默认ID
          title: a.title || "Untitled News",
          image: a.imageUrl || "https://via.placeholder.com/300x200?text=No+Image",
          detail: a.announcementType || "News",
          duration: `${a.startDate || "N/A"} to ${a.endDate || "N/A"}`,
          description: a.description || "No description available",
        };
      }) : [];

      // Set news - use mapped system or emergency announcements or fallback to sample
      if (mappedNews.length === 0) {
        setAllNews(sampleNews);
        setFilteredNews(sampleNews);
      } else {
        setAllNews(mappedNews);
        setFilteredNews(mappedNews);
      }

      // Set all announcements (excluding System and Emergency)
      setAllAnnouncements(mappedAllAnnouncements);
      setFilteredAnnouncements(mappedAllAnnouncements);
      
      // 重置分页
      setNewsCurrentPage(1);
      setAnnouncementsCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setAllNews(sampleNews);
      setFilteredNews(sampleNews);
      setAllAnnouncements([]);
      setFilteredAnnouncements([]);
    }
  };

  const handleFilterChange = (filterType) => {
    if (filterType === 'All') {
      setFilteredAnnouncements(allAnnouncements);
      setFilteredNews(allNews);
    } else {
      // Filter announcements section
      const filteredAnnouncements = allAnnouncements.filter(announcement => 
        announcement.detail === filterType
      );
      setFilteredAnnouncements(filteredAnnouncements);
      
      // Filter news section
      const filteredNews = allNews.filter(newsItem => 
        newsItem.detail === filterType
      );
      setFilteredNews(filteredNews);
    }
    
    // 重置分页
    setNewsCurrentPage(1);
    setAnnouncementsCurrentPage(1);
  };

  // 计算分页数据
  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // 计算总页数
  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // 处理页面切换
  const handlePageChange = (pageNumber, section) => {
    if (section === 'news') {
      setNewsCurrentPage(pageNumber);
    } else if (section === 'announcements') {
      setAnnouncementsCurrentPage(pageNumber);
    }
  };

  // 获取当前页面的数据
  const currentNews = getPaginatedData(filteredNews, newsCurrentPage);
  const currentAnnouncements = getPaginatedData(filteredAnnouncements, announcementsCurrentPage);
  const newsTotalPages = getTotalPages(filteredNews);
  const announcementsTotalPages = getTotalPages(filteredAnnouncements);

  const handleLoginRedirect = () => {
    // Clear guest flag
    localStorage.removeItem("isGuest");
    // Redirect to login
    navigate("/login");
  };

  return (
    <section className="p-10">
      <Container>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Guest!</h1>
          <p className="text-gray-600 mb-4">
            You are currently viewing our public news and announcements.
          </p>
          <button 
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Login to Access Full Portal
          </button>
        </div>

        {/* News Section */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl text-font">News</h1>
          <DropDowns onFilterChange={handleFilterChange} />
        </div>
        <div className="mb-10">
          {Array.isArray(currentNews) && currentNews.length > 0 ? (
            <>
              {currentNews.map((el, idx) => (
                <div
                  key={el.id}
                  className={`${
                    idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } flex items-start p-5 bg-white rounded-xl shadow-md mb-5 gap-5`}
                >
                  {/* Image */}
                  <div className="w-64 h-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={el.image}
                      alt={el.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <h1 className="text-xl font-semibold text-gray-800">
                      {el.title}
                    </h1>

                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">{el.detail}</p>
                      <p className="text-xs text-gray-400">({el.duration})</p>
                    </div>

                    <p className="text-sm text-gray-700 text-justify mt-5">
                      {el.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* News Pagination */}
              {newsTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(newsCurrentPage - 1, 'news')}
                      disabled={newsCurrentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        newsCurrentPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(newsTotalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber, 'news')}
                          className={`w-10 h-10 rounded-full ${
                            newsCurrentPage === pageNumber
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(newsCurrentPage + 1, 'news')}
                      disabled={newsCurrentPage === newsTotalPages}
                      className={`px-3 py-1 rounded-md ${
                        newsCurrentPage === newsTotalPages 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-5 rounded-xl shadow-md mb-5">
              <p className="text-gray-500 text-center py-5">No news available at this time</p>
            </div>
          )}
        </div>

        {/* Announcements Section */}
        <div>
          <div className="flex justify-between items-center my-5">
            <h1 className="text-2xl text-font">Announcements</h1>
          </div>
          {Array.isArray(currentAnnouncements) && currentAnnouncements.length > 0 ? (
            <>
              <div className="flex justify-between gap-5 flex-wrap">
                {currentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 w-80 flex-shrink-0"
                  >
                    {/* Image */}
                    <div className="h-40 w-full overflow-hidden rounded-md">
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {announcement.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {announcement.detail} ({announcement.duration})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Announcements Pagination */}
              {announcementsTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(announcementsCurrentPage - 1, 'announcements')}
                      disabled={announcementsCurrentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        announcementsCurrentPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(announcementsTotalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber, 'announcements')}
                          className={`w-10 h-10 rounded-full ${
                            announcementsCurrentPage === pageNumber
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(announcementsCurrentPage + 1, 'announcements')}
                      disabled={announcementsCurrentPage === announcementsTotalPages}
                      className={`px-3 py-1 rounded-md ${
                        announcementsCurrentPage === announcementsTotalPages 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="text-gray-500 text-center py-5">No announcements available</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default GuestHomePage;