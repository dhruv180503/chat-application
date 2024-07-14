import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext)

  const handelSearch = async () => {
    try {
      const q = query(collection(db, 'users'), where('displayName', '==', username));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data()); // Assuming there's only one user with this username
        setErr(false); // Reset error state if user found
      });
      if (querySnapshot.empty) {
        setUser(null); // Reset user state if no user found
        setErr(true); // Set error state if user not found
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      setErr(true); // Handle error state for network issues or query errors
    }
  };

  const handelKey = (e) => {
    if (e.code === 'Enter') {
      handelSearch();
    }
  };

  const handelSelect = async () => {
    const combineId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combineId));
      if (!res.exists()) {
        // Create a new chat document with an empty messages array
        await setDoc(doc(db, "chats", combineId), { messages: [] });

        // Update userChats for current user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combineId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combineId + ".date"]: serverTimestamp()
        });

        // Update userChats for the other user
        await updateDoc(doc(db, "userChats", user.uid), {
          [combineId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combineId + ".date"]: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error creating/updating chat:', error);
    }
    setUser(null)
    setUsername("")
  };


  return (
    <div className='search'>
      <div className='searchForm'>
        <input
          type='text'
          placeholder='Find a user'
          onKeyDown={handelKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className='userChat' onClick={handelSelect}>
          <img src={user.photoURL} alt='' />
          <div className='userChatInfo'>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
