import ImageGetter from "../services/ImageGetter";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


const MainPage = ({ user, setUser, server, validateToken }) => {
    
    useEffect(() => {         
    }, []);

    return (
        <div className="app-container" style={{marginTop:50}}>
            <h1> Eventual </h1>
            <p> Con esta aplicación podras obtener información 
                sobre eventos de todo tipo que esten cerca de ti</p>

            <h3> Podrás: </h3>
            <ul>
                <li> Ver eventos próximos indicando tu dirección postal </li>
                <li> Crear tus propios eventos, modificarlos y borrarlos </li>
            </ul>

            <p>
                Accede a las diferentes secciones en la barra de navegación
                superior.
            </p>

    
            
        </div>
    );
};

export default MainPage;
