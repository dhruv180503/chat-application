import React, { useContext } from 'react';
import camera from "../img/camera.png";
import add from "../img/add.png";
import more from "../img/more.png";
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const { data } = useContext(ChatContext);

  console.log("Chat context data:", data); // Log chat context data

  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span>{data.user?.displayName}</span>
        <div className='chatIcons'>
          <img src={camera} alt='camera icon' />
          <img src={add} alt='add icon' />
          <img src={more} alt='more icon' />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
}

export default Chat;
