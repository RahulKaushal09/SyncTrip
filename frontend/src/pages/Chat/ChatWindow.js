import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/chat.css';
import { GoArrowLeft } from "react-icons/go";
import { BsSend } from 'react-icons/bs';

const socket = io(process.env.REACT_APP_BACKEND_BASE_URL, { withCredentials: true });

const ChatWindow = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('messages');
    const [isTyping, setIsTyping] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const messagesEndRef = useRef(null);
    const chatBodyRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const chatContainerBodyRef = useRef(null);
    // Get current user from localStorage
    const token = localStorage.getItem('userToken');
    const user = localStorage.getItem('user');
    const currentUser = user ? JSON.parse(user) : null;
    const currentUserId = currentUser ? currentUser._id : null;

    // Debug logs
    console.log('Current User:', currentUser);
    console.log('Token:', token);
    console.log('Trip ID:', tripId);
    console.log('Connected Users:', connectedUsers);
    console.log('Chat Users:', chatUsers);

    // Fetch trip details and connected users
    useEffect(() => {
        if (!token || !currentUser || !tripId) {
            console.log('Missing token, user, or tripId, redirecting to /trips');
            navigate('/trips');
            return;
        }

        const fetchTripAndUsers = async () => {
            try {
                // Fetch trip details
                const tripResponse = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/enrolled/${tripId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!tripResponse.ok) {
                    throw new Error(`Failed to fetch trip details: ${tripResponse.status}`);
                }
                const tripData = await tripResponse.json();
                setTrip(tripData);

                // Filter connected users (status: 0)
                const connected = tripData.peopleApplied.filter(
                    (u) => u.status === 0 && u._id !== currentUserId
                );
                setConnectedUsers(connected);

                // Fetch existing chats for the trip
                const chatsResponse = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/chats?tripId=${tripId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!chatsResponse.ok) {
                    throw new Error(`Failed to fetch chats: ${chatsResponse.status}`);
                }

                const chats = await chatsResponse.json();
                const chatUsersList = chats.map((chat) => {
                    const otherUser = chat.users.find((u) => u._id !== currentUserId);
                    return {
                        ...otherUser,
                        chatId: chat._id,
                        latestMessage: chat.latestMessage ? chat.latestMessage.content : '',
                    };
                });
                setChatUsers(chatUsersList);
            } catch (error) {
                console.error('Error fetching trip or chats:', error);
                navigate('/trips');
            }
        };

        fetchTripAndUsers();
    }, [tripId, token, currentUserId, navigate]);

    useEffect(() => {
        if (chatContainerBodyRef.current) {
            // Scroll the page to the top of this container (smooth scroll)
            chatContainerBodyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [chatId]);

    // Handle selecting a user to chat with
    const selectUser = async (userId) => {
        try {
            console.log(`Selecting user: ${userId}`);
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/chats`,
                { userId, tripId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChatId(response.data._id);
            setOtherUser(response.data.users.find((u) => u._id !== currentUserId));
            if (window.innerWidth <= 768) {
                setIsChatActive(true);
            } else {
                setIsChatActive(false);
            }

            socket.emit('join_chat', response.data._id);
            console.log(`Joined chat room: ${response.data._id}`);

            const messagesResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/messages/${response.data._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(messagesResponse.data);

            // Scroll to bottom after messages are loaded
            setTimeout(() => {
                if (chatBodyRef.current) {
                    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
                }
            }, 0);

            if (!chatUsers.find((u) => u._id === userId)) {
                const newChatUser = response.data.users.find((u) => u._id === userId);
                setChatUsers([...chatUsers, { ...newChatUser, chatId: response.data._id, latestMessage: '' }]);
            }
        } catch (error) {
            console.error('Error initiating chat:', error);
        }
    };

    // Handle back to user list
    const handleBackToList = () => {
        setChatId(null);
        setOtherUser(null);
        setMessages([]);
        setIsChatActive(false);
    };

    // Handle incoming messages and typing events
    useEffect(() => {
        socket.on('receive_message', (message) => {
            console.log('Received message:', message);
            if (message.chat === chatId) {
                setMessages((prevMessages) => {
                    if (!prevMessages.find((m) => m._id === message._id)) {
                        return [...prevMessages, message];
                    }
                    return prevMessages;
                });
            }
        });

        socket.on('typing', (receivedChatId) => {
            console.log(`Typing event received for chat: ${receivedChatId}`);
            if (receivedChatId === chatId) {
                setIsTyping(true);
            }
        });

        socket.on('stop_typing', (receivedChatId) => {
            console.log(`Stop typing event received for chat: ${receivedChatId}`);
            if (receivedChatId === chatId) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('typing');
            socket.off('stop_typing');
        };
    }, [chatId]);

    // Scroll to bottom of chat when messages or isTyping change
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Send message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) {
            console.log('No message or chatId, aborting send');
            return;
        }

        try {
            socket.emit('stop_typing', chatId);
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/messages`,
                { content: newMessage, chatId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Message sent:', response.data);
            setNewMessage('');

            // Update chatUsers with the latest message
            setChatUsers((prevChatUsers) =>
                prevChatUsers.map((u) =>
                    u.chatId === chatId ? { ...u, latestMessage: response.data.content } : u
                )
            );
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle typing indicator
    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!chatId) {
            console.log('No chatId, skipping typing event');
            return;
        }

        socket.emit('typing', chatId);
        console.log(`Emitted typing for chat: ${chatId}`);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', chatId);
            console.log(`Emitted stop_typing for chat: ${chatId}`);
        }, 3000);
    };

    return (
        <div className="chat-container-chating" ref={chatContainerBodyRef}>
            <div className="row g-0">
                {/* Sidebar - Hidden in mobile view when chat is active */}
                {(!isChatActive) && (
                    <div className="col-12 col-md-4 col-lg-3 sidebar-chating">
                        <div className="sidebar-header-chating">
                            <button
                                className="btn btn-white-chating me-2"
                                onClick={() => navigate(`/trips/enrolled/${tripId}`)}
                            >
                                <GoArrowLeft />
                            </button>
                            <h5>{trip ? trip.title : 'Loading...'}</h5>
                        </div>
                        <div className="sidebar-tabs-chating">
                            <button
                                className={`tab-btn-chating ${activeTab === 'messages' ? 'active-chating' : ''}`}
                                onClick={() => setActiveTab('messages')}
                            >
                                Messages {chatUsers.length > 0 && <span className="badge-chating">{chatUsers.length}</span>}
                            </button>
                            <button
                                className={`tab-btn-chating ${activeTab === 'people' ? 'active-chating' : ''}`}
                                onClick={() => setActiveTab('people')}
                            >
                                People {connectedUsers.length > 0 && <span className="badge-chating">{connectedUsers.length}</span>}
                            </button>
                        </div>
                        <div className="sidebar-content-chating">
                            {activeTab === 'messages' && (
                                <div className="user-list-chating">
                                    {chatUsers.length > 0 ? (
                                        chatUsers.map((user) => (
                                            <button
                                                key={user._id}
                                                className={`user-item-chating ${chatId && user.chatId === chatId ? 'active-chating' : ''}`}
                                                onClick={() => selectUser(user._id)}
                                            >
                                                <img
                                                    src={user.profile_picture?.[0] || 'https://via.placeholder.com/40'}
                                                    alt={user.name}
                                                    className="user-avatar-chating"
                                                />
                                                <div className="user-info-chating">
                                                    <strong>{user.name}</strong>
                                                    {user.latestMessage && (
                                                        <p className="latest-message-chating">
                                                            {user.latestMessage.length > 30
                                                                ? user.latestMessage.substring(0, 31) + '...'
                                                                : user.latestMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="no-content-chating">No chats yet.</div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'people' && (
                                <div className="user-list-chating">
                                    {connectedUsers.length > 0 ? (
                                        connectedUsers
                                            .filter((user) => !chatUsers.find((cu) => cu._id === user._id))
                                            .map((user) => (
                                                <button
                                                    key={user._id}
                                                    className="user-item-chating"
                                                    onClick={() => selectUser(user._id)}
                                                >
                                                    <img
                                                        src={user.profile_picture?.[0] || 'https://via.placeholder.com/40'}
                                                        alt={user.name}
                                                        className="user-avatar-chating"
                                                    />
                                                    <div className="user-info-chating">
                                                        <strong>{user.name}</strong>
                                                        <p className="start-chat-chating">Start a chat</p>
                                                    </div>
                                                </button>
                                            ))
                                    ) : (
                                        <div className="no-content-chating">No connected users available.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                <div className={`col-12 ${isChatActive ? 'col-md-12' : 'col-md-8 col-lg-9'} chat-area-chating`}>
                    {chatId && otherUser ? (
                        <div className="chat-card-chating">
                            <div className="chat-header-chating">
                                {isChatActive && window.innerWidth <= 768 && (
                                    <button className="btn btn-white-chating me-2" onClick={handleBackToList}>
                                        <GoArrowLeft />
                                    </button>
                                )}
                                <img
                                    src={otherUser.profile_picture?.[0] || 'https://via.placeholder.com/40'}
                                    alt={otherUser.name}
                                    className="chat-avatar-chating"
                                />
                                <h5>{otherUser.name}</h5>
                            </div>
                            <div className="chat-body-chating" ref={chatBodyRef}>
                                {messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={`message-chating ${message.sender._id === currentUserId ? 'sent-chating' : 'received-chating'}`}
                                    >
                                        <div className="message-content-chating">
                                            <small>
                                                {message.sender.name} -{' '}
                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </small>
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="message-chating received-chating">
                                        <div className="message-content-chating typing-indicator-chating">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="chat-footer-chating">
                                <form onSubmit={handleSendMessage} className="message-form-chating">
                                    <input
                                        type="text"
                                        className="message-input-chating"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={handleTyping}
                                    />
                                    <button type="submit" className=" btn-chating btn-accent-chating" >
                                        <i className="bi bi-send"></i>
                                        <BsSend />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="no-chat-chating">
                            <p>Select a user to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;