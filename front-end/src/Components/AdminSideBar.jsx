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
import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminSideBar = () => {
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
          id: 2,
          name: "Students",
          icon: faUser,
          link: "/admin/students",
          isCurrent: false,
        },
        {
          id: 3,
          name: "Lecturers",
          icon: faUser,
          link: "/admin/lecturers",
          isCurrent: false,
        },
        {
          id: 4,
          name: "Visa/Passport",
          icon: faPassport,
          link: "/admin/visa-passports",
          isCurrent: false,
        },
        {
          id: 5,
          name: "Scholarships",
          icon: faGraduationCap,
          link: "/admin/scholarships",
          isCurrent: false,
        },
        {
          id: 6,
          name: "Tuition Payments",
          icon: faMoneyCheck,
          link: "/admin/tuition-payments",
          isCurrent: false,
        },
        {
          id: 7,
          name: "Visa Extensions",
          icon: faPassport,
          link: "/admin/visa-extensions",
          isCurrent: false,
        },
        {
          id: 8,
          name: "Transfer Programs",
          icon: faGraduationCap,
          link: "/admin/transfer-programs",
          isCurrent: false,
        },
        {
          id: 9,
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
     ],
    },
 ]);

  // Handle Management menu clicks
  const handleMenus = (id) => {
    setSideBarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === id
          ? { ...menu, isCurrent: true }
          : { ...menu, isCurrent: false }
     )
    );
  };

  // Handle Management child menu clicks
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

  // Handle Academic child menu clicks
  const academicMenuHandler = (id) => {
setSideBarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === 2 // Academic menu
          ? {
              ...menu,
              children: menu.children.map((child) =>
                child.id === id
                  ? { ...child, isCurrent: true }
                  : {...child, isCurrent: false }
              ),
            }
          : menu
      )
    );
  };

  return(
    <nav className="fixed bg-iconic w-80 h-screen flex flex-col justify-start items-start gap-3 p-5 overflow-y-auto">
      {sideBarMenus.map((menu) =>
        menu.children == null ? (
          <Link
            key={menu.id}
            to={menu.link}
            className={`text-2xl p-5 ${
              menu.isCurrent ? "bg-white text-iconic" : "text-white"
            } w-full rounded-md flex items-center`}
            onClick={() => handleMenus(menu.id)}
          >
            <FontAwesomeIcon icon={menu.icon} className="w-6 h-6 mr-3" />
            {menu.name}
          </Link>
        ) : (
          <div
            key={menu.id}
            className={`text-2xl p-5 w-full rounded-md flex flex-col cursor-pointer transition-all duration-200 ${
              menu.isCurrent
                ? "bg-white text-iconic"
                : "text-white hover:bg-white/10"
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
                className={`transform transition-transform duration-200 ${
                  menu.isCurrent ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Child Menu */}
            {menu.isCurrent && (
              <div className="mt-4 ml-8 flex flex-col gap-2 text-base text-gray-700 overflow-y-auto max-h-96">
                {menu.children.map((child)=> (
                  <Link
                    key={child.id}
                    to={child.link}
                    className={`transition-colors duration-200 text-xl py-3 ${
                      child.isCurrent
                        ? "text-iconic font-bold"
                        : "hover:text-iconic"
                    }`}
                    onClick={(e)=> {
                      e.stopPropagation(); // prevent parent click
                      if (menu.id === 1) {
                        managementMenuHandler(child.id);
                      } else if (menu.id === 2) {
                        academicMenuHandler(child.id);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={child.icon} className="w-4 h-4 mr-2" />
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </nav>
  );
};

export default AdminSideBar;