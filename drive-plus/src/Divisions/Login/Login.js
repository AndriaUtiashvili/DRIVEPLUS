import { useEffect, useState } from 'react';
import LoginApi from '../../API/Login';
import './login.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';


function Login({ currentUser, setCurrentUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function LoginUser() {
        var model = {
            email: email,
            password: password
        }

        const user = await LoginApi(model);
        setCurrentUser(user);
    }

    useEffect(() => {
        if(currentUser) 
            navigate('/home');
    }, [currentUser, navigate])
    
    return (
        <>
            <div className='login-container'></div>
            <div className="login">
                <h1>Welcome Back to DrivePlus</h1>
                <p className="subtext">Track your trips, optimize your profits, drive smarter.</p>
                <div className='login-inputs'>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                </div>
                <button onClick={() => LoginUser()}>Log In</button>

                <p className="signup-link">
                    Don't have an account? <Link to='/signup'>Sign up</Link>
                </p>
            </div>
        </>
    )
}

export default Login;