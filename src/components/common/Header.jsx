
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">24</span>
          <span>24.zip</span>
        </Link>

        <nav className="header-nav">
          <Link to="/">서비스 소개</Link>
          <a href="#service">서비스 이용 안내</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
