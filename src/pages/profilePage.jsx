import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("user_data")) || {};
  const [registerData, setRegisterData] = useState({
    user: { id: data.user.id },
    name: data.user.name,
    email: data.user.email,
    phone: data.user.phone_number,
    role: data.user.role,
  });

  const handleInputChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.token}`
        },
        body: JSON.stringify(registerData),
      });
      const result = await response.json();
      console.log("Register response:", result);
      setError(result)
      if(result.info){
        setError('')
      }
    } catch (error) {
      setError(error)
      console.error("Register error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-red-800 to-blue-800 h-screen">
      <div className="flex flex-row text-white gap-40 rounded-xl">
        <div className="flex-1">
          <form
            className="gap-2 w-80 flex flex-col"
            onSubmit={handleRegisterSubmit}
          >
            <h1 className="text-center font-semibold text-4xl mb-6">
              Profile Page
            </h1>
            <input
              className="p-2 rounded-md bg-[rgba(0,0,0,0.3)]"
              type="text"
              name="name"
              placeholder="name"
              value={registerData.name}
              onChange={(e) => handleInputChange(e, setRegisterData)}
            />
            <input
              className="p-2 rounded-md bg-[rgba(0,0,0,0.3)]"
              type="email"
              name="email"
              placeholder="email"
              value={registerData.email}
              onChange={(e) => handleInputChange(e, setRegisterData)}
            />
            <input
              className="p-2 rounded-md bg-[rgba(0,0,0,0.3)]"
              type="text"
              name="phone"
              placeholder="phone"
              value={registerData.phone}
              onChange={(e) => handleInputChange(e, setRegisterData)}
            />
            <select
              name="role"
              className="p-2 rounded-md bg-[rgba(0,0,0,0.3)]"
              value={registerData.role}
              onChange={(e) => handleInputChange(e, setRegisterData)}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Institute">Institute</option>
            </select>
            <button className="mt-2 bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-md">
              Update
            </button>
          </form>
          <button onClick={() => navigate('/chat')} className="w-80 mt-2 bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-md">
              Go To Chats
          </button>
        </div>
      </div>
      {error && (
                    <div className="text-white font-sans absolute bottom-20">{JSON.stringify(error)}</div>
            )}
    </div>
  );
};

export default Profile;
