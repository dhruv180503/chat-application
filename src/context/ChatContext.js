import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

const INITIAL_STATE = {
    chatId: 'null',
    user: {},
    currentUser: null,
};

const chatReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload,
            };
        case 'CHANGE_USER':
            if (!state.currentUser || !action.payload) {
                console.error("Current user or action payload is undefined");
                return state;
            }
            console.log("Action payload:", action.payload); // Log action payload
            return {
                ...state,
                user: action.payload,
                chatId: state.currentUser.uid > action.payload.uid
                    ? state.currentUser.uid + action.payload.uid
                    : action.payload.uid + state.currentUser.uid,
            };
        default:
            return state;
    }
};

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const [state, dispatch] = useReducer(chatReducer, { ...INITIAL_STATE, currentUser });

    useEffect(() => {
        if (currentUser) {
            dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
        }
    }, [currentUser]);

    console.log("ChatContext state:", state); // Log state

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};
