import ImageGetter from "../services/ImageGetter";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const MainPage = ({ user, setUser, server, validateToken }) => {
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    
    useEffect(() => {
        
    }, []);

    return (
        <div className="app-container">
            <h1> Página principal</h1>
            <h2> Imagenes subidas </h2>

            <p> Filtro de búsqueda </p>
            <input
                type="text"
                onChange={(event) => setCollection(event.target.value)}
            />
            
            <ImageGetter
                collection={collection}
                validateToken={validateToken}
                setUser={setUser}
                server={server}
                user={user}
            />
            
        </div>
    );
};

export default MainPage;
