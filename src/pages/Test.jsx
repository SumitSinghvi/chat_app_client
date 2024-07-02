import React, { useEffect, useState } from "react";

const TestPage = () => {
    const userId = JSON.parse(localStorage.getItem("user_data")).user.id || {};
    const [activeUsers, setActiveUsers] = useState('');
    useEffect(() => {
        fetch('http://localhost:5000/api/user/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: 'student' }),
        })
        .then(response => response.json())
        .then(data => {
            const filteredUsers = data.filter(user => user.id !== userId);
            setActiveUsers(filteredUsers)
        })
        .catch(error => console.error('Error fetching active users:', error));
    }, []);
    console.log(activeUsers)
    return ( 
        <div className="bg-black h-screen">
            hi
        </div>
     );
}
 
export default TestPage;