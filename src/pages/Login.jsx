import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';


const Login = () => {

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            setError('Failed to log in. Please check your email and password.');
        }
    };
    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Lama chat</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>

                    <input type='email' placeholder='email'></input>
                    <input type='password' placeholder='password'></input>

                    <button type='submit'>Sign in</button>
                    {error && <span>{error}</span>}
                </form>
                <p>You don't have an account?<a href="/register">Register</a></p>

            </div>
        </div>
    )
}

export default Login
