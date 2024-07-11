import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";
import { IoPersonCircle } from "react-icons/io5";
import { TiArrowBackOutline } from "react-icons/ti";
import io from "socket.io-client";
import { ApiUrl } from "../Api/api";
import "./index.css";

const ChatPage = () => {
  const history = useHistory();
  const jwt_token = Cookies.get("jwt_token");
  const storedUserObject = useSelector(
    (state) => state.chatUser.chatUserProfile
  );
  const { profileImage, username, state, userId } =
    JSON.parse(storedUserObject);
  const senderId = useSelector((state) => state.user.userId);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null); // Reference to the chat box container

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    // Create socket connection when the component mounts
    const socketInstance = io(ApiUrl, {
      path: "/chat",
      query: { receiverId: userId, senderId: senderId },
      auth: {
        token: jwt_token,
      }, // Pass userId as a query parameter
    });

    // Save the socket instance in state
    setSocket(socketInstance);

    // Clean up socket connection when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, [userId, senderId, jwt_token]); // Re-establish socket connection when these dependencies change

  useEffect(() => {
    // Listen for initial messages when socket is defined
    if (socket) {
      // console.log("fetched initial");
      socket.on("initial_messages", (initialMessages) => {
        // console.log("initial=>", initialMessages);
        const filterMessages = initialMessages.filter(
          (each) =>
            (each.senderId === senderId && each.receiverId === userId) ||
            (each.senderId === userId && each.receiverId === senderId)
        );
        setMessages(filterMessages);
      });
    }

    // Clean up listener when component unmounts
    return () => {
      if (socket) {
        socket.off("initial_messages");
      }
    };
  }, [socket, userId, senderId]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (newMessage) => {
        // console.log("receive==>", newMessage);
        const condition =
          (newMessage.senderId === senderId &&
            newMessage.receiverId === userId) ||
          (newMessage.senderId === userId &&
            newMessage.receiverId === senderId);
        if (condition) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [socket, senderId, userId]);

  const sendMessage = (e) => {
    // e.preventDefault();
    if (userInput.trim() !== "") {
      const messageObj = {
        receiverId: userId,
        senderId: senderId,
        message: userInput.trim(),
      };

      // Emit message to the server with user information/sending
      socket.emit("sent_message", messageObj);

      setUserInput("");
    }
  };
  const handleKeyDown = (e) => {
    // e.preventDefault();
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      sendMessage(); // Call sendMessage function when Enter key is pressed
    }
  };
  useEffect(() => {
    // Function to scroll to the bottom of the chat box
    const scrollToBottom = () => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    };
    scrollToBottom(); // Scroll to bottom initially
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input element when the component mounts
    inputRef.current.focus();
  }, []);

  // console.log("usermesse==>", messages);
  return (
    <div className="chatpage-bg">
      <nav className="chat-navpage">
        <div className="chat-profile-navpage">
          {profileImage === "" ? (
            <IoPersonCircle fontSize={40} />
          ) : (
            <img src={profileImage} alt="" className="chat-profile-pic" />
          )}

          <div className="chat-address">
            <h4 className="chat-username">{username}</h4>
            <p className="chat-state">{state}</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => history.goBack()}
            type="button"
            className="back-arrow-btn"
          >
            <TiArrowBackOutline title="Back to Chats" className="back-arrow" />
          </button>
        </div>
      </nav>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((each, index) => (
          <div
            key={index}
            className={
              each.senderId === senderId
                ? "message-parent-right"
                : "message-parent-left"
            }
          >
            <p
              className={
                each.senderId === senderId ? "sender-text" : "receiver-text"
              }
            >
              {each.message}
            </p>
          </div>
        ))}
      </div>
      <div className="chat-input-parent">
        <input
          name="userinput"
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Enter your message...."
          className="user-chat-input"
        />
        <button onClick={sendMessage} className="sent-btn">
          <FiSend className="sent-icon" />
        </button>
      </div>
    </div>
  );
};
export default ChatPage;
