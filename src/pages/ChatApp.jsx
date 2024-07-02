import { LogOut, PlusIcon, SendIcon, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ChatApp = () => {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user_data")).user.id || {};
  const token = JSON.parse(localStorage.getItem("user_data")).token || {};
  const user = JSON.parse(localStorage.getItem("user_data")) || {};
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(socket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId]);

  useEffect(() => {
    fetchUsersByRole("student", setStudents);
    fetchUsersByRole("teacher", setTeachers);
    fetchUsersByRole("institute", setInstitutes);
  }, []);

  const fetchUsersByRole = (role, setUsers) => {
    fetch("http://localhost:5000/api/user/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredUsers = data.filter((user) => user.id !== userId);
        setUsers(filteredUsers);
      })
      .catch((error) => console.error(`Error fetching ${role}s:`, error));
  };

  useEffect(() => {
    if (selectedUser) {
      fetch(
        `http://localhost:5000/api/chat/messages/${userId}/${selectedUser.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [selectedUser, userId, token]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (socket) {
      const receiverId = selectedUser.id;
      const data = {
        senderId: userId,
        receiverId,
        message,
      };
      socket.emit("sendMessage", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessage("");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderUserList = (users, title) => (
    <div className="mb-4">
      <h3 className="text-md font-semibold border-y border-black">{title}</h3>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex-1 truncate cursor-pointer border border-black rounded-sm p-2 my-2"
          onClick={() => setSelectedUser(user)}
        >
          <div className="font-medium text-sm capitalize text-gray-600">
            {user.name}, {user.status === 'online' ? <span className="text-green-500">Online</span> : 'Offline'}
          </div>
          <div className="text-sm text-muted-foreground">
            {user.lastMessage}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid min-h-screen w-full grid-cols-[300px_1fr] bg-gradient-to-b from-red-200 to-blue-600">
      <div className="border-r bg-muted/40 p-4">
        <div className="space-y-2">
          {renderUserList(students, "Students")}
          {renderUserList(teachers, "Teachers")}
          {renderUserList(institutes, "Institutes")}
        </div>
        <div
          onClick={() => navigate("/profile")}
          className="cursor-pointer flex w-52 items-center absolute bottom-16 border border-black p-2 rounded-sm"
        >
          <h1 className="capitalize">
            {user.user.name}, {user.user.role}
          </h1>
          <Settings className="ml-auto" />
        </div>
        <div
          onClick={logout}
          className="cursor-pointer flex w-52 items-center absolute bottom-4 border border-black p-2 rounded-sm"
        >
          <h1 className="capitalize">Logout</h1>
          <LogOut className="ml-auto" />
        </div>
      </div>
      <div className="flex flex-col h-screen">
        <div className="w-full text-start border-b p-2 font-thin text-2xl">
          {selectedUser
            ? `Chatting with ${selectedUser?.name}`
            : "Welcome to Chats"}
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  msg.sender_id === userId ? "justify-end" : ""
                }`}
              >
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">
                      {msg.sender_id === userId ? "You" : selectedUser.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      msg.sender_id === userId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t bg-muted/40 p-4">
          <div className="relative">
            <form onSubmit={sendMessage}>
              <input
                placeholder="Type your message..."
                className="bg-gradient-to-b from-red-200 to-blue-200 min-h-[48px] w-full resize-none rounded-2xl border border-neutral-400 p-4 pr-16 shadow-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="absolute top-3 right-3 h-8 w-8">
                <SendIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
