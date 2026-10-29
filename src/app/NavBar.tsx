import { Link, NavLink, useNavigate } from 'react-router-dom';
import { selectCartCount, useCartStore } from '@/features/cart/stores/cartStore';
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/stores/authStore';

export const NavBar = () => {
  const cartCount = useCartStore(selectCartCount);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        MotoXpress
      </Link>

      <nav className="navbar-links" aria-label="Main">
        <NavLink to="/parts">Parts</NavLink>
        <NavLink to="/cart">Cart{cartCount > 0 ? ` (${cartCount})` : ''}</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/orders">My orders</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button type="button" className="link-button" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};
