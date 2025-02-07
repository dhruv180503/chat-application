import React, { useContext, useState } from 'react';
import Gallery from "../img/gallery.png";
import Attach from "../img/attach.png";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle progress if needed
        },
        (error) => {
          setError('Upload failed.');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              })
            });
          } catch (e) {
            setError('Error updating document.');
          }
        }
      );

    } else {
      try {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          })
        });
      } catch (e) {
        setError('Error updating document.');
      }
    }
    setText("");
    setImg(null);
  };

  return (
    <div className='input'>
      {error && <p className="error">{error}</p>}
      <input
        type='text'
        placeholder='Type something...'
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className='send'>
        <img src={Attach} alt='Attach' />
        <input
          type='file'
          style={{ display: 'none' }}
          id='file'
          onChange={e => setImg(e.target.files[0])}
        />
        <label htmlFor='file'>
          <img src={Gallery} alt='Gallery' />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Input;
