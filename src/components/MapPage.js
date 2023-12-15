import Map from "../services/Map";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../assets/css/Map.css";

import axios from "axios";

function MapPage({ user, setUser, validateToken, server }) {
    const [eventos, setEventos] = useState([]); // Array de todas las imágenes
    const navigate = useNavigate();

    // fetch data de los eventos
    const getEventos = async () => {
        const response = await axios.get(server + "/eventos", {
            headers: {
                Authorization: localStorage.getItem("usuario"),
            },
        });

        // Guardar la colección en el estado
        setEventos(response.data);
    }

    useEffect(() => {
        const token = localStorage.getItem("usuario");

        // Comprueba si el token es válido y si no lo es, redirige al login
        if (token) {
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
    }, []);

    const mapMarkers = 
        eventos.map((evento) => {
        if(evento.coordenadas && evento.images){
            return {
                location:{
                    lat: evento.coordenadas.lat,
                    long: evento.coordenadas.long
                },
                name: evento.anfitrion,
                description: evento.descripcion,
                img: evento.images[0].secure_url,
            }
        }else{
            return null;
        }
    }).filter((evento) => {
        return evento != null;
    });

    return (
        <div className="map-page">
            <h1>MapPage</h1>
            
            <Map
                pos = {[36.602274, -4.531727]}
                markers={mapMarkers}
            />
        </div>
    );

    // {
    //     location: {
    //         lat: 36.602274,
    //         long: -4.531727,
    //     },
    //     name: "Malaga",
    //     description: "Malaga es una ciudad de España",
    // },
    // {
    //     location: {
    //         lat: 37.602274,
    //         long: -4.531727,
    //     },
    //     name: "Sevilla",
    //     description: "Sevilla es una ciudad de España",
    //     img : "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQOO0X7mMnoYz-e9Zdc6Pe6Wz7Ow1DcvhEiaex5aSv6QJDoCtcooqA7UUbjrphvjlIc",
    // },
}

export default MapPage;
