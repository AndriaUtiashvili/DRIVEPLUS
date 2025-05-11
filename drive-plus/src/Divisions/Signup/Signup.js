import { useState, useEffect } from 'react';
import './signup.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import RegisterApi from '../../API/Register';

function Signup({ currentUser, setCurrentUser }) {

    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if(currentUser) 
            navigate('/home');
    }, [currentUser, navigate])

    async function handleSubmit(e) {
        e.preventDefault();
        if(registerData.firstName.trim() === '' ||
        registerData.lastName.trim() === '' ||
        registerData.email.trim() === '' ||
        registerData.password.trim() === '')
            return;

        const new_user = await RegisterApi(registerData);
        setCurrentUser(new_user);

        navigate('/home');
    }

    return (
        <>
            <div className='signup-container'></div>
            <div className="signup">
                <h1>Welcome to DrivePlus</h1>
                <p className="subtext">Track your trips, optimize your profits, drive smarter.</p>
                <form className='signup-form' onSubmit={(e) => handleSubmit(e)}>
                    <input value={registerData.name} onChange={(e) => setRegisterData(x => ({...x, firstName: e.target.value}))} 
                    placeholder="Name" />
                    <input value={registerData.lastName} onChange={(e) => setRegisterData(x => ({...x, lastName: e.target.value}))} 
                     placeholder="Last Name" />
                    <input value={registerData.email} onChange={(e) => setRegisterData(x => ({...x, email: e.target.value}))} 
                     type="email" placeholder="Email Address" />
                    <input value={registerData.password} onChange={(e) => setRegisterData(x => ({...x, password: e.target.value}))} 
                     type="password" placeholder="Password" />
                    <button type="submit">Sign Up</button>
                </form>

                <p className="login-link">
                    Already have an account? <Link to="/">Log In</Link>
                </p>
            </div>
        </>
    )
}

export default Signup;