import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInput">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt='' />
        <span>{message.senderId === currentUser.uid ? currentUser.displayName : data.user.displayName}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt='' />}
      </div>
    </div>
  );
};

export default Message;
