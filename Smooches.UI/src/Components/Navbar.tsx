import { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Primary destinations, shared by the desktop bar and the mobile hamburger.
const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: 'fa-gauge', exact: true },
  { to: '/request-service', label: 'Request', icon: 'fa-cart-shopping', exact: false },
  { to: '/leave-review', label: 'Reviews', icon: 'fa-star', exact: false },
];

// Account actions, shown in the desktop dropdown and the mobile hamburger.
const accountLinks = [
  { to: '/create-service', label: 'Create service', icon: 'fa-plus' },
  { to: '/user-connect', label: 'Link accounts', icon: 'fa-link' },
];

export default function MyNavbar() {
  const { user } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false); // desktop account dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile hamburger panel

  const logout = () => firebase.auth().signOut();
  const closeMenu = () => setMenuOpen(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          onClick={closeMobile}
          className="flex items-center gap-3 font-heading text-lg font-extrabold tracking-wide"
        >
          <i className="fa-solid fa-mobile-screen-button text-3xl text-accent" aria-hidden />
          SMOOCHES
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              exact={link.exact}
              to={link.to}
              className="nav-link"
              activeClassName="active"
            >
              {link.label}
            </NavLink>
          ))}

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
                    {accountLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={closeMenu}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-surface"
                      >
                        <i className={`fa-solid ${link.icon} w-4 text-accent`} aria-hidden />{' '}
                        {link.label}
                      </Link>
                    ))}
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-card border border-line text-foreground hover:border-accent md:hidden"
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden />
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <nav className="border-t border-line bg-surface-elevated px-4 py-2 md:hidden">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              exact={link.exact}
              to={link.to}
              onClick={closeMobile}
              className="flex items-center gap-2.5 rounded-card px-2 py-2.5 text-sm hover:bg-surface"
              activeClassName="text-accent"
            >
              <i className={`fa-solid ${link.icon} w-4 text-accent`} aria-hidden /> {link.label}
            </NavLink>
          ))}

          {user && (
            <>
              <div className="my-1 border-t border-line" />
              {user.displayName && (
                <div className="px-2 py-1.5 text-xs text-muted">{user.displayName}</div>
              )}
              {accountLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobile}
                  className="flex items-center gap-2.5 rounded-card px-2 py-2.5 text-sm hover:bg-surface"
                >
                  <i className={`fa-solid ${link.icon} w-4 text-accent`} aria-hidden /> {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  closeMobile();
                  logout();
                }}
                className="flex w-full items-center gap-2.5 rounded-card px-2 py-2.5 text-left text-sm hover:bg-surface"
              >
                <i className="fa-solid fa-arrow-right-from-bracket w-4 text-accent" aria-hidden />{' '}
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
