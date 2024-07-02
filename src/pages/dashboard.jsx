import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const data = JSON.parse(localStorage.getItem("user_data")) || {};
    useEffect(() => {
        if(data.token){
            navigate('/chat')
        }
    }
    ,[])
    const [error, setError] = useState('');
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", phone: "", role: "Student" });

    const handleInputChange = (e, setData) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });
            const result = await response.json();
            if (result.token) {
                localStorage.setItem("user_data", JSON.stringify(result));
                navigate("/chat");
            }
            else{
                setError(result);
            }
        } catch (error) {
            setError(error);
            console.error("Login error:", error);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            });
            const result = await response.json();
            if (result.token) {
                localStorage.setItem("user_data", JSON.stringify(result));
                navigate("/profile");
            }
            else{
                setError(result);
            }

        } catch (error) {
            setError(error);
            console.error("Register error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-red-800 to-blue-800 h-screen">
            <div className="flex flex-row text-white gap-40 rounded-xl">
                <div className="flex-1">
                    <form className="gap-2 w-80 flex flex-col" onSubmit={handleLoginSubmit}>
                        <h1 className="text-center font-semibold text-4xl mb-6">Login</h1>
                        <input
                            className="p-2 rounded-md bg-[rgba(0,0,0,0.3)]"
                            type="email"
                            name="email"
                            placeholder="email"
                            value={loginData.email}
                            onChange={(e) => handleInputChange(e, setLoginData)}
                        />
                        <input
                            className="p-2 rounded-md bg-[rgba(0,0,0,0.3)]"
                            type="password"
                            name="password"
                            placeholder="password"
                            value={loginData.password}
                            onChange={(e) => handleInputChange(e, setLoginData)}
                        />
                        <button className="mt-2 bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-md">Let me in</button>
                    </form>
                </div>
                <div className="flex-1 w-[0.5px] bg-white" />
                <div className="flex-1">
                    <form className="gap-2 w-80 flex flex-col" onSubmit={handleRegisterSubmit}>
                        <h1 className="text-center font-semibold text-4xl mb-6">Register</h1>
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
                            type="password"
                            name="password"
                            placeholder="password"
                            value={registerData.password}
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
                        <button className="mt-2 bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-md">Let me in</button>
                    </form>
                </div>
            </div>
            {error && (
                    <div className="text-white font-sans absolute bottom-20">{JSON.stringify(error)}</div>
            )}
        </div>
    );
};

export default Dashboard;
