import{ faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faGraduationCap,
  faHome,
  faListCheck,
  faListOl,
  faRoute
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const [sideBarMenus, setSideBarMenus] = useState([
    {
      id: 1,
      name: "Home",
      icon: faHome,
      link: "/",
      isCurrent: true,
      children: null,
    },
    {
      id: 2,
      name: "Academic",
      icon: faGraduationCap,
      link: "/academic",
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Study Plan",
          icon: faRoute,
          link: "/study-plan",
          isCurrent: false,
        },
        {
          id: 2,
          name: "Transcripts",
          icon: faListOl,
          link: "/transcripts",
          isCurrent: true,
       },
        {
          id: 3,
          name: "Attendances",
          icon: faListCheck,
          link: "/attendence",
          isCurrent: false,
        },
      ],
    },
    {
      id: 3,
      name: "Profile",
      icon: faUser,
      link: "/profile",
      isCurrent: false,
      children: [
        {
          id: 1,
          name: "Dashboard",
          icon: faHome,
          link: "/profile",
          isCurrent: false,
        },
        {
          id: 2,
          name: "Change Password",
          icon: faUser,
          link: "/change-password",
          isCurrent: false,
        },
],
    },
 ]);

  // 根据当前路径更新菜单状态
  useEffect(() => {
    // 检查顶级菜单
    const updatedMenus = sideBarMenus.map(menu => {
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
          isCurrent: hasActiveChild || location.pathname.startsWith(menu.link), 
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
          : menu.id === 2 || menu.id === 3 ? { ...menu, isCurrent: false } : menu
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
                      if (menu.id === 2) {
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

export default SideBar;