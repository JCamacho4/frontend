import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import axios from "axios";

const MyProfile = ({ user, setUser, server, validateToken }) => {
    
    const navigate = useNavigate();

    const [eventos, setEventos] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem("usuario");
        if (token) {
            // Comprueba si el token es válido y si no lo es, redirige al login
            validateToken(token).then((response) => {
                if (response) {
                    const userObject = jwtDecode(token);
                    setUser(userObject);
                } else {
                    localStorage.removeItem("usuario");
                    setUser(null);
                    navigate("/");
                }
            });
            
            fetchData();

        } else {
            navigate("/");
        }
    },[]);

    const fetchData = async () => {
        const response = await axios.get(
            server + "/eventos/" + user.email + "/agenda",
            {
                headers: {
                    Authorization: localStorage.getItem("usuario"),
                },
            }
        );
        setEventos(response.data);
    };
    
    
    // Mostrar la información del usuario y su token
    
    const initialDate = new Date(0);
    initialDate.setUTCSeconds(user?.iat);

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(user?.exp);


    return (
        <div className="app-container">
            <h1>Bienvenido {user.name}</h1>
            <h3>{user.email}</h3>
            <img src={user.picture} alt={user.name} />
            <p>El token se proporcionó:  {initialDate.toLocaleString()}</p>
            <p>El token expirará:  {expirationDate.toLocaleString()}</p>

            <br/>

            <h2> Tu agenda con los próximos eventos</h2>
            {
                // Mostrar los eventos de la agenda
                eventos.map((evento, index) => (
                    <div key={index}>
                        <p> Anfitrión: {evento.anfitrion}</p>
                        <p> Fecha: {evento.fecha}</p>
                        <p> Descripción: {evento.descripcion}</p>
                        <br/>
                    </div>
                ))

            }
        </div>
    );
};

export default MyProfile;
