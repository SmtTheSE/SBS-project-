import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Components/MainLayout";
import AdminLayout from "../Components/AdminLayout";
import Login from "../Pages/Login";
import ErrorPage from "../Pages/ErrorPage";
import ProfilePage from "../Pages/ProfilePage";
import Transcripts from "../Pages/Transcripts";
import StudyPlan from "../Pages/StudyPlan";
import Attendance from "../Pages/Attendance";
import HomePage from "../Pages/HomePage";
import AdminAnnouncementManager from "../Pages/AdminAnnouncementManager";
import AdminStudentManager from "../Pages/AdminStudentManager";
import AdminLecturerManager from "../Pages/AdminLecturerManager";
import AdminVisaPassportManager from "../Pages/AdminVisaPassportManager";
import AdminScholarshipManager from "../Pages/AdminScholarshipManager";
import AdminTuitionPaymentManager from "../Pages/AdminTuitionPaymentManager";
import AdminVisaExtensionRequestManager from "../Pages/AdminVisaExtensionRequestManager";
import VisaPassport from "../Pages/VisaPassport";

// Academic admin pages
import AdminStudyPlanManager from "../Pages/AdminStudyPlanManager";
import AdminCourseManager from "../Pages/AdminCourseManager";
import AdminSemesterManager from "../Pages/AdminSemesterManager";
import AdminDepartmentManager from "../Pages/AdminDepartmentManager";
import AdminGradeManager from "../Pages/AdminGradeManager";
import AdminEnrollmentManager from "../Pages/AdminEnrollmentManager";
import AdminAttendanceManager from "../Pages/AdminAttendanceManager";
import AdminCourseResultManager from "../Pages/AdminCourseResultManager";
import AdminTranscriptRequestManager from "../Pages/AdminTranscriptRequestManager";
import AdminStudentAcademicBackgroundManager from "../Pages/AdminStudentAcademicBackgroundManager";
import AdminStudentEnglishPlacementTestManager from "../Pages/AdminStudentEnglishPlacementTestManager";
import AdminClassScheduleManager from "../Pages/AdminClassScheduleManager";
import AdminLecturerCourseManager from "../Pages/AdminLecturerCourseManager";
import AdminTransferProgramManager from "../Pages/AdminTransferProgramManager";
import AdminPartnerInstitutionManager from "../Pages/AdminPartnerInstitutionManager";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "transcripts",
        element: <Transcripts />
      },
      {
        path: "study-plan",
        element: <StudyPlan />
      },
      {
        path: "attendence",
        element: <Attendance />
      },
      {
        path: "visa-passport",
        element: <VisaPassport />
      }
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  // Admin Routes
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "announcements",
        element: <AdminAnnouncementManager />,
      },
      {
        path: "students",
        element: <AdminStudentManager />,
      },
      {
        path: "lecturers",
        element: <AdminLecturerManager />,
      },
      {
        path: "visa-passports",
        element: <AdminVisaPassportManager />,
      },
      {
        path: "scholarships",
        element: <AdminScholarshipManager />,
      },
      {
        path: "tuition-payments",
        element: <AdminTuitionPaymentManager />,
      },
      {
        path: "visa-extensions",
        element: <AdminVisaExtensionRequestManager />,
      },
      {
        path: "transfer-programs",
        element: <AdminTransferProgramManager />,
      },
      {
        path: "partner-institutions",
        element: <AdminPartnerInstitutionManager />,
      },
      // Academic Routes
      {
        path: "academic/study-plans",
        element: <AdminStudyPlanManager />,
      },
      {
        path: "academic/courses",
        element: <AdminCourseManager />,
      },
      {
        path: "academic/semesters",
        element: <AdminSemesterManager />,
      },
      {
        path: "academic/departments",
        element: <AdminDepartmentManager />,
      },
      {
        path: "academic/grades",
        element: <AdminGradeManager />,
      },
      {
        path: "academic/enrollments",
        element: <AdminEnrollmentManager />,
      },
      {
        path: "academic/attendance",
        element: <AdminAttendanceManager />,
      },
      {
        path: "academic/course-results",
        element: <AdminCourseResultManager />,
      },
      {
        path: "academic/transcript-requests",
        element: <AdminTranscriptRequestManager />,
      },
      {
        path: "academic/student-backgrounds",
        element: <AdminStudentAcademicBackgroundManager />,
      },
      {
        path: "academic/student-placement-tests",
        element: <AdminStudentEnglishPlacementTestManager />,
      },
      {
        path: "academic/class-schedules",
        element: <AdminClassScheduleManager />,
      },
      {
        path: "academic/lecturer-course-mapping",
        element: <AdminLecturerCourseManager />,
      },
    ],
  },
]);

export default router;