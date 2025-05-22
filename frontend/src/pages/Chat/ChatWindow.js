import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../../styles/chat.css'; // Adjust the path as necessary

const socket = io(process.env.REACT_APP_BACKEND_BASE_URL); // Update with your backend URL

const ChatWindow = ({ tripId, otherUserId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Get current user ID from localStorage
    const currentUser = localStorage.getItem('user');
    const token = localStorage.getItem('userToken');


    // Fetch chat and user details
    useEffect(() => {
        // if (!currentUser || !otherUserId || !tripId) {
        //     navigate('/'); // Redirect if missing required data
        //     return;
        // }

        const fetchChat = async () => {
            try {
                // Fetch or create chat
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/chats`,
                    { userId: otherUserId, tripId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setChatId(response.data._id);

                // Join Socket.IO room
                socket.emit('join_chat', response.data._id);

                // Fetch other user details
                const otherUserData = response.data.users.find(
                    (user) => user._id !== currentUser._id
                );
                setOtherUser(otherUserData);

                // Fetch messages
                const messagesResponse = await axios.get(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/messages/${response.data._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessages(messagesResponse.data);
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        };

        fetchChat();
    }, [currentUser, otherUserId, tripId, navigate]);

    // Handle incoming messages
    useEffect(() => {
        socket.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, []);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) return;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/messages`,
                { content: newMessage, chatId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="container mt-4 chat-container">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                    <button className="btn btn-outline-light me-2" onClick={() => navigate(-1)}>
                        &larr; Back
                    </button>
                    <h5 className="mb-0">
                        Chat with {otherUser ? otherUser.name : 'Loading...'}
                    </h5>
                </div>
                <div className="card-body chat-body">
                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className={`d-flex mb-3 ${message.sender._id === currentUser._id ? 'justify-content-end' : 'justify-content-start'
                                }`}
                        >
                            <div
                                className={`p-2 rounded ${message.sender._id === currentUser._id
                                    ? 'bg-primary text-white'
                                    : 'bg-light text-dark'
                                    }`}
                                style={{ maxWidth: '70%' }}
                            >
                                <small className="d-block text-muted">
                                    {message.sender.name} - {new Date(message.createdAt).toLocaleTimeString()}
                                </small>
                                <p className="mb-0">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="card-footer">
                    <form onSubmit={handleSendMessage} className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;