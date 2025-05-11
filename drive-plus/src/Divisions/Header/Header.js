import './header.css'
import Logo from '../../images/logo.png'
import Button from 'react-bootstrap/Button';
import LogoutApi from '../../API/Logout';
import { useNavigate } from 'react-router';

function Header({ setCurrentUser }) {
    const navigate = useNavigate();
    async function Logout() {
        await LogoutApi();
        setCurrentUser(null);
        navigate('/');
    }
    return (
        <div className="header">
            <div className='header-logo'>
                <img alt='logo' src={Logo} />
            </div>
            <div className='logout-container'>
                <Button onClick={() => Logout()} className='logout-btn' variant="outline-light">
                    <i class="bi bi-box-arrow-left"></i>
                    {"\u00A0"}
                    {"\u00A0"}
                    <h4 className='logout'>Logout</h4>
                </Button>
            </div>
        </div>
    )
}

export default Header;