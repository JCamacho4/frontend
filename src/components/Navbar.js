import "../assets/css/Navbar.css";

const NavBar = ({ user, setUser }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "lightblue", padding:"20px"}}>
        <a className="navbar-brand" href="/">
          Eventual {""}
        </a>

        {user && (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/map">
                  Cerca de ti
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/new-event">
                  Nuevo evento
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/my-profile">
                  Mi perfil
                </a>
              </li>
            </ul>
          </div>
        )}

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav custom-right">
            {user ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/my-profile">
                    {user.name}
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/"
                    onClick={() => {
                      localStorage.removeItem("usuario");
                      setUser(null);
                    }}
                  >
                    Cerrar sesión
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Login
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
