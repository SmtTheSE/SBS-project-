import React, { useEffect, useState } from "react";
import DropDowns from "../Components/DropDown";
import Container from "../Components/Container";
import axios from "axios";

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // CDN / backend base path for images (used when DB stores only filenames)
  const IMAGE_BASE_URL = "https://cdn.sbs.edu.vn/announcements/";

  // Fallback sample news (used when backend has none)
  const sampleNews = [
    {
      id: 1,
      title: "Student Portal Maintenance",
      image:
        "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=800&q=80",
      detail: "System / Tech",
      duration: "July 7 to July 9, 2025",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate repudiandae vel doloribus! Ab dignissimos iusto repudiandae, unde ut quod eos quia atque molestias deleniti non amet voluptatum explicabo assumenda eaque!",
    },
    {
      id: 2,
      title: "Student Portal Maintenance",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      detail: "System / Tech",
      duration: "July 7 to July 9, 2025",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate repudiandae vel doloribus! Ab dignissimos iusto repudiandae, unde ut quod eos quia atque molestias deleniti non amet voluptatum explicabo assumenda eaque!",
    },
  ];

  useEffect(() => {
    fetchAnnouncements();
    fetchNews();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/announcements/active"
      );
      const data = Array.isArray(response.data) ? response.data : [];

      const mapped = data.map((a) => {
        let imageUrl = a.imageUrl || "";
        // if it's not a full URL, prepend base path
        if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
          imageUrl = `${IMAGE_BASE_URL}${imageUrl}`;
        }

        return {
          id: a.announcementId,
          title: a.title,
          image: imageUrl || "https://via.placeholder.com/300x200?text=No+Image",
          detail: a.announcementType,
          duration: `${a.startDate} to ${a.endDate}`,
          description: a.description || "",
        };
      });

      setAnnouncements(mapped);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setAnnouncements([]);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/news"); // optional backend
      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length === 0) {
        setNews(sampleNews);
      } else {
        setNews(data);
      }
    } catch (err) {
      console.warn("News API not available, falling back to sample.");
      setNews(sampleNews);
    }
  };

  return (
    <section className="p-10">
      <Container>
        {/* News Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-font">News</h1>
          <DropDowns />
        </div>
        <div>
          {news.map((el, idx) => (
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
        </div>

        {/* Announcements Section */}
        <div>
          <h1 className="text-2xl text-font my-5">Announcements</h1>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements available</p>
          ) : (
            <div className="flex justify-between gap-5">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 w-100"
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
          )}
        </div>
      </Container>
    </section>
  );
};

export default HomePage;
