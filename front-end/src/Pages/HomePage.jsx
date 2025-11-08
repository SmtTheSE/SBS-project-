import React, { useEffect, useState } from "react";
import DropDowns from "../Components/DropDown";
import Container from "../Components/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  // 分页状态
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [announcementsCurrentPage, setAnnouncementsCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每页显示的项目数
  const navigate = useNavigate();

  // 弹窗状态
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // Check if user is a guest
    const isGuest = localStorage.getItem("isGuest") === "true";
    if (isGuest) {
      // Redirect guest users to guest home page
      navigate("/guest");
      return;
    }

    // For logged-in users, check if they have a token
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login
      navigate("/login");
    } else {
      // If token exists, fetch announcements
      fetchAnnouncements();
    }
  }, [navigate]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/announcements/active"
      );
      // 确保数据是数组
      const data = Array.isArray(response.data) ? response.data : [];

      // Filter announcements for news section (System or Emergency type)
      const systemOrEmergencyAnnouncements = data.filter(
        (a) =>
          a.announcementType === "System" || a.announcementType === "Emergency"
      );

      // Filter announcements for announcements section (NOT System or Emergency type)
      const otherAnnouncements = data.filter(
        (a) =>
          a.announcementType !== "System" && a.announcementType !== "Emergency"
      );

      // Map all announcements
      const mappedAllAnnouncements = Array.isArray(otherAnnouncements)
        ? otherAnnouncements.map((a) => {
            return {
              id: a.announcementId || Date.now() + Math.random(), // 添加默认ID
              title: a.title || "Untitled Announcement",
              image:
                a.imageUrl ||
                "https://via.placeholder.com/300x200?text=No+Image",
              detail: a.announcementType || "General",
              duration: `${a.startDate || "N/A"} to ${a.endDate || "N/A"}`,
              description: a.description || "No description available",
            };
          })
        : [];

      // Map announcements for news section
      const mappedNews = Array.isArray(systemOrEmergencyAnnouncements)
        ? systemOrEmergencyAnnouncements.map((a) => {
            return {
              id: a.announcementId || Date.now() + Math.random(), // 添加默认ID
              title: a.title || "Untitled News",
              image:
                a.imageUrl ||
                "https://via.placeholder.com/300x200?text=No+Image",
              detail: a.announcementType || "News",
              duration: `${a.startDate || "N/A"} to ${a.endDate || "N/A"}`,
              description: a.description || "No description available",
            };
          })
        : [];

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
    if (filterType === "All") {
      setFilteredAnnouncements(allAnnouncements);
      setFilteredNews(allNews);
    } else {
      // Filter announcements section
      const filteredAnnouncements = allAnnouncements.filter(
        (announcement) => announcement.detail === filterType
      );
      setFilteredAnnouncements(filteredAnnouncements);

      // Filter news section
      const filteredNews = allNews.filter(
        (newsItem) => newsItem.detail === filterType
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
    if (section === "news") {
      setNewsCurrentPage(pageNumber);
    } else if (section === "announcements") {
      setAnnouncementsCurrentPage(pageNumber);
    }
  };

  // Get current page data
  const currentNews = getPaginatedData(filteredNews, newsCurrentPage);
  const currentAnnouncements = getPaginatedData(
    filteredAnnouncements,
    announcementsCurrentPage
  );
  const newsTotalPages = getTotalPages(filteredNews);
  const announcementsTotalPages = getTotalPages(filteredAnnouncements);

  // 打开弹窗
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <section className="p-10">
      <Container>
        {/* News Section */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl text-font font-bold">News</h1>
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
                  } flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 gap-6 border border-gray-100 transform hover:-translate-y-1`}
                >
                  {/* Image */}
                  <div className="w-64 h-40 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={el.image}
                      alt={el.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <h1
                      className="text-xl font-bold text-gray-800 cursor-pointer hover:text-red-600 transition-colors duration-200"
                      onClick={() => openModal(el)}
                    >
                      {el.title}
                    </h1>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full transition-all duration-300 hover:shadow-md">
                        {el.detail}
                      </span>
                      <p className="text-xs text-gray-500">({el.duration})</p>
                    </div>

                    {/* 移除了预览中的描述文字 */}

                    <button
                      onClick={() => openModal(el)}
                      className="mt-4 text-red-600 hover:text-red-800 font-semibold self-start flex items-center group"
                    >
                      See more
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* News Pagination */}
              {newsTotalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(newsCurrentPage - 1, "news")
                      }
                      disabled={newsCurrentPage === 1}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        newsCurrentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      Previous
                    </button>

                    {[...Array(newsTotalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber, "news")}
                          className={`w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            newsCurrentPage === pageNumber
                              ? "bg-red-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        handlePageChange(newsCurrentPage + 1, "news")
                      }
                      disabled={newsCurrentPage === newsTotalPages}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        newsCurrentPage === newsTotalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <p className="text-gray-500 text-center py-5 animate-pulse">
                No news available at this time
              </p>
            </div>
          )}
        </div>

        {/* Announcements Section */}
        <div>
          <div className="flex justify-between items-center my-6">
            <h1 className="text-2xl text-font font-bold">Announcements</h1>
          </div>
          {Array.isArray(currentAnnouncements) &&
          currentAnnouncements.length > 0 ? (
            <>
              <div className="flex justify-between gap-6 flex-wrap">
                {currentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 w-80 flex-shrink-0 border border-gray-100 hover:border-gray-200 transform transition-transform duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="h-40 w-full overflow-hidden rounded-lg">
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-4">
                      <p
                        className="text-sm font-bold text-gray-800 line-clamp-2 cursor-pointer hover:text-red-600 transition-colors duration-200"
                        onClick={() => openModal(announcement)}
                      >
                        {announcement.title}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded transition-all duration-300 hover:shadow-sm">
                          {announcement.detail}
                        </span>
                        <p className="text-xs text-gray-500 truncate">
                          ({announcement.duration})
                        </p>
                      </div>

                      {/* 移除了预览中的描述文字 */}

                      <button
                        onClick={() => openModal(announcement)}
                        className="mt-4 text-red-600 hover:text-red-800 text-sm font-semibold flex items-center group"
                      >
                        See more
                        <svg
                          className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Announcements Pagination */}
              {announcementsTotalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(
                          announcementsCurrentPage - 1,
                          "announcements"
                        )
                      }
                      disabled={announcementsCurrentPage === 1}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        announcementsCurrentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      Previous
                    </button>

                    {[...Array(announcementsTotalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() =>
                            handlePageChange(pageNumber, "announcements")
                          }
                          className={`w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            announcementsCurrentPage === pageNumber
                              ? "bg-red-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        handlePageChange(
                          announcementsCurrentPage + 1,
                          "announcements"
                        )
                      }
                      disabled={
                        announcementsCurrentPage === announcementsTotalPages
                      }
                      className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        announcementsCurrentPage === announcementsTotalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <p className="text-gray-500 text-center py-5 animate-pulse">
                No announcements available
              </p>
            </div>
          )}
        </div>
      </Container>

      {/* Modal for displaying full content */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedItem.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-light transition-colors duration-200"
                >
                  &times;
                </button>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                  {selectedItem.detail}
                </span>
                <p className="text-sm text-gray-500">
                  ({selectedItem.duration})
                </p>
              </div>

              <div className="mt-8">
                <div className="h-96 w-full overflow-hidden rounded-xl">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-8">
                  <p className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePage;
