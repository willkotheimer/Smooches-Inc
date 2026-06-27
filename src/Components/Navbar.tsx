import { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function MyNavbar() {
  const { user } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => firebase.auth().signOut();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-3 font-heading text-lg font-extrabold tracking-wide"
        >
          <i className="fa-solid fa-mobile-screen-button text-3xl text-accent" aria-hidden />
          SMOOCHES
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink exact to="/" className="nav-link" activeClassName="active">
            Dashboard
          </NavLink>
          <NavLink to="/request-service" className="nav-link" activeClassName="active">
            Request
          </NavLink>
          <NavLink to="/leave-review" className="nav-link" activeClassName="active">
            Reviews
          </NavLink>

          {user && (
            <div className="relative ml-1">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-card border border-line text-foreground hover:border-accent"
                aria-label="More"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-7 w-7 rounded-card object-cover" />
                ) : (
                  <i className="fa-solid fa-ellipsis-vertical" aria-hidden />
                )}
              </button>

              {menuOpen && (
                <>
                  {/* click-away backdrop */}
                  <div className="fixed inset-0 z-10" onClick={closeMenu} />
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-card border border-line bg-surface-elevated py-1 shadow-lg">
                    {user.displayName && (
                      <div className="border-b border-line px-3 py-2 text-xs text-muted">
                        {user.displayName}
                      </div>
                    )}
                    <Link
                      to="/create-service"
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-surface"
                    >
                      <i className="fa-solid fa-plus w-4 text-accent" aria-hidden /> Create service
                    </Link>
                    <Link
                      to="/user-connect"
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-surface"
                    >
                      <i className="fa-solid fa-link w-4 text-accent" aria-hidden /> Link accounts
                    </Link>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-surface"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket w-4 text-accent" aria-hidden />{' '}
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
