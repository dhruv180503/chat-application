import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chats, setChats] = useState({});

  useEffect(() => {
    const getChats = () => {
      if (!currentUser || !currentUser.uid) {
        console.log("No current user or UID found");
        return;
      }

      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          console.log("Firestore document data:", doc.data()); // Log Firestore data
          setChats(doc.data());
        } else {
          console.log("No such document!");
        }
      }, (error) => {
        console.error("Error fetching chats: ", error);
      });

      return () => {
        unsub();
      };
    };

    getChats();
  }, [currentUser]);

  console.log("Chats state:", chats); // Log chats state

  const handleSelect = (user) => {
    if (user) {
      console.log("Selected user:", user); // Log selected user
      dispatch({ type: "CHANGE_USER", payload: user });
    } else {
      console.error("Selected user is undefined");
    }
  };

  return (
    <div className="chats">
      {chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(([key, chat]) => (
        <div
          className="userChat"
          key={key}
          onClick={() => {
            console.log("User info:", chat.userInfo); // Log user info before passing to handleSelect
            handleSelect(chat.userInfo);
          }}
        >
          {chat?.userInfo?.photoURL && (
            <img
              src={chat.userInfo.photoURL}
              alt="User"
            />
          )}
          <div className="userChatInfo">
            <span>{chat.userInfo?.displayName}</span>
            <p>{chat.lastMessage?.text || "No messages yet"}</p> {/* Display last message */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
