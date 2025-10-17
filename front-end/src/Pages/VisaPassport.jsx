import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import SubContainer from "../Components/SubContainer";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const VisaPassport = () => {
  const [visaPassports, setVisaPassports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
if(!token) {
      navigate("/login");
      return;
    }

    axiosInstance.get("/profile")
      .then((res) => {
        const studentId = res.data.studentId;
        setStudentId(studentId);
        fetchVisaPassportData(studentId, token);
      })
      .catch(()=>navigate("/login"));
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

const getVisaTypeText = (visaType) => {
    return visaType === 1 ?'Multiple Entry' : 'Single Entry';
  };

const handleRequestExtension = async (visaPassportId, studentId) => {
    // Confirm with user before sending request
    if (!window.confirm("Are you sure you want to request a visa extension?")) {
      return;
    }

   try {
// Using the correct admin ID from the database
      const adminId = 'ADM001'; // Fixed the admin ID to match the database record
      
      // Generate a unique ID for the extension request (must be <= 15 characters to fit DB column)
      const extensionRequestId = 'VER' +Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3);
      
      const requestData = {
        extensionRequestId: extensionRequestId,
        visaPassportId: visaPassportId,
        studentId: studentId,
        adminId: adminId,
        requestDate: new Date().toISOString().split('T')[0],
        requestedExtensionUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0], // 3 months from now
        status: 0, // Pending
        notes: 'Visaextension requestfrom student'
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
             <p>Loadingvisa/passport information...</p>
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

 return(
    <section className="p-10">
      <Container>
        <SubContainer>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Visa/Passport Information</h1>
          <p className="text-gray-600 mb-8">
            View your visa and passport details
          </p>

          {visaPassports.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No visa/passport records found</p>
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
                  {visaPassports.map((record) => (
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