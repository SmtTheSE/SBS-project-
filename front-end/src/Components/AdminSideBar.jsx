import{ faUser } from "@fortawesome/free-regular-svg-icons";
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
  faClipboardList} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AdminSideBar = () => {
  const location = useLocation();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sideBarMenus, setSideBarMenus] = useState([
   {
      id: 1,
      name: "Management",
      icon: faUser,
      link: "/admin",
      isCurrent: true,
      children: [
        {
          id: 1,
          name: "Announcements",
          icon: faUser,
          link: "/admin/announcements",
isCurrent: false,
        },
        {
          id: 3,
          name: "Students",
          icon: faUser,
          link: "/admin/students",
          isCurrent: false,
        },
        {
          id: 4,
          name: "Lecturers",
          icon: faUser,
          link: "/admin/lecturers",
          isCurrent: false,
        },
        {
          id: 5,
          name: "Visa/Passport",
          icon: faPassport,
          link: "/admin/visa-passports",
          isCurrent: false,
        },
        {
          id: 6,
          name: "Scholarships",
          icon: faGraduationCap,
          link: "/admin/scholarships",
          isCurrent: false,
        },
        {
          id: 7,
          name: "Tuition Payments",
          icon: faMoneyCheck,
          link: "/admin/tuition-payments",
          isCurrent: false,
        },
        {
          id: 8,
          name: "Visa Extensions",
          icon: faPassport,
          link: "/admin/visa-extensions",
          isCurrent: false,
        },
        {
          id: 9,
          name: "Transfer Programs",
          icon: faGraduationCap,
          link: "/admin/transfer-programs",
          isCurrent: false,
        },
        {
          id: 10,
          name: "Partner Institutions",
          icon: faUser,
          link: "/admin/partner-institutions",
          isCurrent: false,
        },
      ],
    },
    {
      id: 2,
      name: "Academic",
      icon: faBook,
      link: "/admin/academic",
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Study Plans",
          icon: faRoute,
          link: "/admin/academic/study-plans",
          isCurrent: false,
        },
        {
          id: 2,
          name: "Courses",
          icon: faChalkboardTeacher,
          link: "/admin/academic/courses",
          isCurrent: false,
        },
        {
          id: 3,
          name: "Semesters",
icon: faCalendarAlt,
          link: "/admin/academic/semesters",
          isCurrent: false,
        },
        {
          id: 4,
          name: "Departments",
          icon: faUser,
          link: "/admin/academic/departments",
          isCurrent: false,
       },
        {
          id: 5,
          name: "Grades",
          icon: faClipboardList,
          link: "/admin/academic/grades",
          isCurrent: false,
        },
        {
          id: 6,
          name: "Student Enrollments",
          icon: faUser,
         link: "/admin/academic/enrollments",
          isCurrent: false,
        },
        {
          id: 7,
          name: "Attendance",
          icon: faListCheck,
          link: "/admin/academic/attendance",
          isCurrent: false,
        },
        {
          id: 8,
name: "Course Results",
          icon: faClipboardList,
          link: "/admin/academic/course-results",
          isCurrent: false,
        },
        {
          id: 9,
          name: "Transcript Requests",
          icon: faGraduationCap,
          link: "/admin/academic/transcript-requests",
          isCurrent: false,
        },
        {
          id: 10,
          name: "Student Backgrounds",
          icon: faUser,
          link: "/admin/academic/student-backgrounds",
          isCurrent: false,
        },
        {
          id: 11,
          name:"Placement Tests",
          icon: faClipboardList,
          link: "/admin/academic/student-placement-tests",
          isCurrent: false,
        },
       {
          id: 12,
          name: "Class Schedules",
          icon: faCalendarAlt,
          link: "/admin/academic/class-schedules",
          isCurrent: false,
        },
        {
          id: 13,
          name: "Lecturer-Course Mapping",
          icon: faChalkboardTeacher,
          link: "/admin/academic/lecturer-course-mapping",
          isCurrent: false,
        },
        {
          id: 14,
          name: "Student Progress Summaries",
          icon: faClipboardList,
          link: "/admin/academic/student-progress-summaries",
          isCurrent: false,
        },
        {
          id: 15,
          name: "Study Plan Courses",
          icon: faClipboardList,
          link: "/admin/academic/study-plan-courses",
          isCurrent: false,
        },
     ],
    },
    {
      id: 3,
      name: "Profile",
      icon: faUser,
      link: "/admin/profile",
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Change Password",
          icon: faUser,
          link: "/admin/change-password",
          isCurrent: false,
        },
      ],
    },
  ]);
  
  // Department-based access rules
  const departmentAccessRules = {
    "DEPT001": { // Student Services
      allowedMenus: [
        { parentId: 1, childIds: [5, 8] }, // Visa/Passport, Visa Extensions
        { parentId: 2, childIds: [9, 10, 11, 14] } // Transcript Requests, Student Backgrounds, Placement Tests, Student Progress Summaries
      ]
    },
    "DEPT002": { // Student Advice
      allowedMenus: [
        { parentId: 2, childIds: [1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 15] } // All Academic sections
      ]
    },
    "DEPT003": { // Finance
      allowedMenus: [
        { parentId: 1, childIds: [6, 7, 9] } // Scholarships, Tuition Payments, Transfer Programs
      ]
    }
  };

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const accountId = localStorage.getItem("accountId");
        
        if (!token || !accountId) {
          setLoading(false);
          return;
        }
        
        // Fetch admin profile information
        const response = await axiosInstance.get(`/admin/${accountId}`);
        setAdminInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
        setLoading(false);
      }
    };
    
    fetchAdminInfo();
  }, []);

  // Filter menus based on department
  const getFilteredMenus = () => {
    // If still loading or no admin info, return all menus
    if (loading || !adminInfo) {
      return sideBarMenus;
    }
    
    // ADM001 can see all sections
    if (adminInfo.adminId === "ADM001") {
      return sideBarMenus;
    }
    
    // Get department ID
    const departmentId = adminInfo.departmentId;
    
    // If no department rules defined, return only profile section
    if (!departmentAccessRules[departmentId]) {
      // Return only the Profile section for departments without specific rules
      return sideBarMenus.filter(menu => menu.id === 3);
    }
    
    // Filter menus based on department rules
    const { allowedMenus } = departmentAccessRules[departmentId];
    
    const filteredMenus = sideBarMenus.map(menu => {
      // Always include Profile section for all admins
      if (menu.id === 3) {
        return menu;
      }
      
      // Find if this parent menu has any allowed children for this department
      const allowedMenu = allowedMenus.find(m => m.parentId === menu.id);
      
      if (allowedMenu) {
        // Filter children based on allowed child IDs
        const filteredChildren = menu.children.filter(child => 
          allowedMenu.childIds.includes(child.id)
        );
        
        return {
          ...menu,
          children: filteredChildren
        };
      }
      
      // If no allowed children, remove this menu section
      return {
        ...menu,
        children: []
      };
    }).filter(menu => menu.id === 3 || menu.children.length > 0); // Only show menus that have children, always show Profile
    
    return filteredMenus;
  };

  const filteredMenus = getFilteredMenus();

  // 根据当前路径更新菜单状态
  useEffect(() => {
    // 检查顶级菜单
    const updatedMenus = filteredMenus.map(menu => {
      // 检查是否是顶级菜单项
      if (location.pathname === menu.link) {
        return { ...menu, isCurrent: true };
      }
      
      // 检查子菜单项
      if (menu.children) {
        // 检查是否有子菜单项匹配当前路径
        const hasActiveChild = menu.children.some(child => location.pathname === child.link);
        const updatedChildren = menu.children.map(child => ({
          ...child,
          isCurrent: location.pathname === child.link
        }));
        
        return { 
          ...menu, 
          isCurrent: hasActiveChild, 
          children: updatedChildren 
        };
      }
      
      // 默认情况保持原状态
      return { ...menu, isCurrent: location.pathname === menu.link };
    });
    
    setSideBarMenus(updatedMenus);
  }, [location.pathname]);

  // Handle top-level menu clicks
  const handleMenus = (id) => {
    setSideBarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === id
          ? { ...menu, isCurrent: !menu.isCurrent }
          : { ...menu, isCurrent: false }
      )
    );
  };

  // Handle Management child menu clicks without affecting top-level menus
  const managementMenuHandler = (id) => {
    setSideBarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === 1 // Management menu
          ? {
              ...menu,
              children: menu.children.map((child) =>
                child.id === id
                  ? { ...child, isCurrent: true }
                  : { ...child, isCurrent: false }
              ),
            }
          : menu
      )
    );
  };

  // Handle Academic child menu clicks without affecting top-level menus
  const academicMenuHandler = (id) => {
    setSideBarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === 2 // Academic menu
          ? {
              ...menu,
              children: menu.children.map((child) =>
                child.id === id
                  ? { ...child, isCurrent: true }
                  : { ...child, isCurrent: false }
              ),
            }
          : menu
      )
    );
  };
  
  // Handle Profile child menu clicks without affecting top-level menus
  const profileMenuHandler = (id) => {
    setSideBarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === 3 // Profile menu
          ? {
              ...menu,
              children: menu.children.map((child) =>
                child.id === id
                  ? { ...child, isCurrent: true }
                  : { ...child, isCurrent: false }
              ),
            }
          : menu
      )
    );
  };

  return (
    <nav className="fixed bg-iconic w-80 h-screen flex flex-col justify-start items-start gap-2 p-5 shadow-2xl">
      {sideBarMenus.map((menu) =>
        menu.children == null ? (
          <Link
            key={menu.id}
            to={menu.link}
            className={`text-2xl p-5 ${
              menu.isCurrent ? "bg-white text-iconic" : "text-white hover:bg-red-700"
            } w-full rounded-xl flex items-center transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg`}
            onClick={() => handleMenus(menu.id)}
          >
            <FontAwesomeIcon icon={menu.icon} className="w-6 h-6 mr-3" />
            {menu.name}
          </Link>
        ) : (
          <div
            key={menu.id}
            className={`text-2xl p-5 w-full rounded-xl flex flex-col cursor-pointer transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg ${
              menu.isCurrent
                ? "bg-white text-iconic"
                : "text-white hover:bg-red-700"
            }`}
          >
            <div 
              className="flex justify-between items-center w-full"
              onClick={() => handleMenus(menu.id)}
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={menu.icon} className="w-6 h-6" />
                <span>{menu.name}</span>
              </div>
              <FontAwesomeIcon
                icon={faAngleDown}
                className={`transform transition-transform duration-300 ${
                  menu.isCurrent ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Child Menu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              menu.isCurrent ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}>
              <div className="ml-8 flex flex-col gap-2 text-base text-gray-700">
                {menu.children.map((child) => (
                  <Link
                    key={child.id}
                    to={child.link}
                    className={`transition-all duration-200 text-xl py-3 px-4 rounded-lg flex items-center ${
                      child.isCurrent
                        ? "text-iconic font-bold bg-red-50"
                        : "hover:text-iconic hover:bg-red-50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent click
                      if (menu.id === 1) {
                        managementMenuHandler(child.id);
                      } else if (menu.id === 2) {
                        academicMenuHandler(child.id);
                      } else if (menu.id === 3) {
                        profileMenuHandler(child.id);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={child.icon} className="w-4 h-4 mr-2" />
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </nav>
  );
};

export default AdminSideBar;