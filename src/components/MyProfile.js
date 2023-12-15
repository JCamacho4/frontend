import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import axios from "axios";

const MyProfile = ({ user, setUser, server, validateToken }) => {
    
    const navigate = useNavigate();
    const [eventos, setEventos] = useState([]); // Array de todos los eventos

    // fetch data de los eventos
    const getEventos = async () => {
        const response = await axios.get(server + "/eventos" + "?organizador=" + user.email, {
            headers: {
                Authorization: localStorage.getItem("usuario"),
            },
        });

        console.log(response.data);

        // Guardar la colección en el estado
        setEventos(response.data);
    }

    useEffect(() => {
        const token = localStorage.getItem("usuario");
        if (token) {
            // Comprueba si el token es válido y si no lo es, redirige al login
            validateToken(token).then((response) => {
                if (response) {
                    const userObject = jwtDecode(token);
                    setUser(userObject);
                    getEventos();
                } else {
                    localStorage.removeItem("usuario");
                    setUser(null);
                    navigate("/");
                }
            });
        
        } else {
            navigate("/");
        }
    },[]);

    const handleEliminar = (id) => async (event) => {
        event.preventDefault();

        const response = await axios.delete(server + "/eventos/" + id, {
            headers: {
                Authorization: localStorage.getItem("usuario"),
            },
        });

        if (response.status === 200) {
            alert("Evento eliminado correctamente");
            getEventos();
        }
    }

    const handleModificar = (id) => async (event) => {
        event.preventDefault();

        navigate("/evento/" + id);
    }
    
    // Mostrar la información del usuario y su token
    
    const initialDate = new Date(0);
    initialDate.setUTCSeconds(user?.iat);

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(user?.exp);


    return (
        <div className="app-container">
            
            <br/>

            <h1>Bienvenido {user.name}</h1>
            <h3>{user.email}</h3>
            <img src={user.picture} alt={user.name} />
            <p>El token se proporcionó:  {initialDate.toLocaleString()}</p>
            <p>El token expirará:  {expirationDate.toLocaleString()}</p>

            <br/>
            <br/>
            <br/>

            <h2>Eventos creados</h2>
            <p> Desde aquí podrás borrarlos y modificarlos</p>

            {
                eventos && 
                eventos.map((evento) => {
                    return (
                        <div style={{width:500, padding:20}}  className="card car-body" key={evento._id}>
                            <h3>{evento.nombre}</h3>
                            <p>{evento.lugar}</p>
                            <img src={evento.imagen}></img>
                            <p>{evento.organizador}</p>
                            <p>{evento.timestamp}</p>

                            <button className="btn btn-danger" onClick={handleEliminar(evento._id)}>Eliminar evento</button>
                            <button className="btn btn-warning" onClick={handleModificar(evento._id)}>Modificar evento</button>
                        </div>
                    )
                })
            }

            
        </div>
    );
};

export default MyProfile;
