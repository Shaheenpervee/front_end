import React, { useState } from 'react';
import './ChatPanel.css';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, inputValue]);
            setInputValue('');
        }
    };

    return (
        <div className="chat-panel-container">
            <div className="message-history">
                <h3>Message History</h3>
                {messages.map((message, index) => (
                    <div key={index} className="message-container">{message}</div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatPanel;
