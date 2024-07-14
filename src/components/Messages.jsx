import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import { doc, onSnapshot } from 'firebase/firestore';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (data.chatId && data.chatId !== "null") {
      const unSub = onSnapshot(
        doc(db, "chats", data.chatId),
        (doc) => {
          if (doc.exists()) {
            console.log("Chat document data:", doc.data());
            setMessages(doc.data().messages || []);
          }
        },
        (error) => {
          console.error("Error fetching chat document:", error);
        }
      );

      return () => {
        unSub();
      };
    }
  }, [data.chatId]);

  return (
    <div className='messages'>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
