import { faUser, faBuilding } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faListCheck,
  faRoute,
  faPassport,
  faGraduationCap,
  faMoneyCheck,
  faBook,
  faChalkboardTeacher,
  faCalendarAlt,
  faClipboardList,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import useAdminSideBar from "../Hook/useAdminSideBar";

const AdminSideBar = () => {
  const location = useLocation();
  const { collapsed, setCollapsed } = useAdminSideBar();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sideBarMenus, setSideBarMenus] = useState([
    {
      id: 1,
      name: "Management",
      icon: faUser,
      isCurrent: true,
      children: [
        {
          id: 1,
          name: "Announcements",
          icon: faUser,
          link: "/admin/announcements",
        },
        {
          id: 2,
          name: "Partner Institutions",
          icon: faBuilding,
          link: "/admin/partner-institutions",
        },
        { id: 3, name: "Students", icon: faUser, link: "/admin/students" },
        { id: 4, name: "Lecturers", icon: faUser, link: "/admin/lecturers" },
        {
          id: 5,
          name: "Departments",
          icon: faBuilding,
          link: "/admin/academic/departments",
        },
        {
          id: 6,
          name: "Visa/Passport",
          icon: faPassport,
          link: "/admin/visa-passports",
        },
        {
          id: 7,
          name: "Scholarships",
          icon: faGraduationCap,
          link: "/admin/scholarships",
        },
        {
          id: 8,
          name: "Tuition Payments",
          icon: faMoneyCheck,
          link: "/admin/tuition-payments",
        },
        {
          id: 9,
          name: "Visa Extensions",
          icon: faPassport,
          link: "/admin/visa-extensions",
        },
        {
          id: 10,
          name: "Transfer Programs",
          icon: faRoute,
          link: "/admin/transfer-programs",
        },
      ],
    },
    {
      id: 2,
      name: "Academic",
      icon: faBook,
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Study Plans",
          icon: faRoute,
          link: "/admin/academic/study-plans",
        },
        {
          id: 2,
          name: "Courses",
          icon: faChalkboardTeacher,
          link: "/admin/academic/courses",
        },
        {
          id: 3,
          name: "Semesters",
          icon: faCalendarAlt,
          link: "/admin/academic/semesters",
        },
        {
          id: 4,
          name: "Grades",
          icon: faClipboardList,
          link: "/admin/academic/grades",
        },
        {
          id: 5,
          name: "Enrollments",
          icon: faListCheck,
          link: "/admin/academic/enrollments",
        },
        {
          id: 6,
          name: "Attendance",
          icon: faCalendarAlt,
          link: "/admin/academic/attendance",
        },
        {
          id: 7,
          name: "Course Results",
          icon: faClipboardList,
          link: "/admin/academic/course-results",
        },
        {
          id: 8,
          name: "Transcript Requests",
          icon: faGraduationCap,
          link: "/admin/academic/transcript-requests",
        },
        {
          id: 9,
          name: "Student Backgrounds",
          icon: faUser,
          link: "/admin/academic/student-backgrounds",
        },
        {
          id: 10,
          name: "Placement Tests",
          icon: faGraduationCap,
          link: "/admin/academic/student-placement-tests",
        },
        {
          id: 11,
          name: "Class Schedules",
          icon: faCalendarAlt,
          link: "/admin/academic/class-schedules",
        },
        {
          id: 12,
          name: "Lecturer Course Mapping",
          icon: faChalkboardTeacher,
          link: "/admin/academic/lecturer-course-mapping",
        },
        {
          id: 13,
          name: "Progress Summaries",
          icon: faUser,
          link: "/admin/academic/student-progress-summaries",
        },
        {
          id: 14,
          name: "Study Plan Courses",
          icon: faRoute,
          link: "/admin/academic/study-plan-courses",
        },
      ],
    },
    {
      id: 3,
      name: "Profile",
      icon: faUser,
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Change Password",
          icon: faUser,
          link: "/admin/change-password",
        },
      ],
    },
  ]);

  // fetch admin info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const accountId = localStorage.getItem("accountId");
        if (!token || !accountId) return setLoading(false);
        const response = await axiosInstance.get(`/admin/${accountId}`);
        setAdminInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminInfo();
  }, []);

  // highlight active route
  useEffect(() => {
    const updatedMenus = sideBarMenus.map((menu) => {
      if (menu.children) {
        const hasActiveChild = menu.children.some(
          (child) => location.pathname === child.link
        );
        const updatedChildren = menu.children.map((child) => ({
          ...child,
          isCurrent: location.pathname === child.link,
        }));
        return {
          ...menu,
          isCurrent: hasActiveChild,
          children: updatedChildren,
        };
      }
      return { ...menu, isCurrent: location.pathname === menu.link };
    });
    setSideBarMenus(updatedMenus);
  }, [location.pathname]);

  const handleMenus = (id) => {
    setSideBarMenus((prev) =>
      prev.map((menu) =>
        menu.id === id
          ? { ...menu, isCurrent: !menu.isCurrent }
          : { ...menu, isCurrent: false }
      )
    );
  };

  return (
    <motion.nav
      animate={{ width: collapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed z-10 bg-iconic h-screen flex flex-col justify-start items-start shadow-xl xs:p-1 md:p-3 overflow-hidden"
    >
      {/* Toggle button inside sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-white w-full px-3 py-3 rounded-md hover:bg-red-700 transition mb-2 flex items-center"
      >
        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
      </button>

      {/* Sidebar Menus */}
      <div className="flex flex-col w-full gap-2">
        {sideBarMenus.map((menu) => (
          <div
            key={menu.id}
            className={`text-lg w-full rounded-lg flex flex-col transition-all duration-300 ${
              menu.isCurrent
                ? "bg-white text-iconic"
                : "text-white hover:bg-red-700"
            }`}
          >
            <div
              className={`flex ${
                collapsed ? "justify-center" : "justify-between"
              } items-center cursor-pointer xs:p-2 md:px-3 md:py-3`}
              onClick={() => handleMenus(menu.id)}
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={menu.icon} className="w-5 h-5" />
                {!collapsed && (
                  <span className="whitespace-nowrap">{menu.name}</span>
                )}
              </div>
              {!collapsed && (
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`transition-transform duration-300 ${
                    menu.isCurrent ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </div>

            {/* Child Menu */}
            <motion.div
              animate={{
                height: menu.isCurrent && !collapsed ? "auto" : 0,
                opacity: menu.isCurrent && !collapsed ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col text-sm text-gray-700 ml-6 mb-2">
                {menu.children.map((child) => (
                  <Link
                    key={child.id}
                    to={child.link}
                    className={`py-2 px-2 rounded flex items-center ${
                      child.isCurrent
                        ? "text-iconic font-bold bg-red-50"
                        : "hover:text-iconic hover:bg-red-50"
                    }`}
                    onClick={() => setCollapsed(!collapsed)}
                  >
                    <FontAwesomeIcon
                      icon={child.icon}
                      className="w-3 h-3 mr-2"
                    />
                    {!collapsed && child.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default AdminSideBar;
