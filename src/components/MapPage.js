import Map from "../services/Map";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../assets/css/Map.css";

import axios from "axios";

function MapPage({ user, setUser, validateToken, server }) {
    const [eventos, setEventos] = useState([]); // Array de todas las imágenes
    const navigate = useNavigate();

    const [posUser, setPosUser] = useState([36.7209914, -4.4216968]); // Array de todas las imágenes

    const [lugar, setLugar] = useState("");

    const geocode = async (sitio) => {
        const uri = "https://geocode.maps.co/search?q=";
    
        if (!sitio) {
            return;
        }
    
        console.log(sitio);
        const response = await axios.get(uri + sitio.replace(/%20/g, "") + ",Spain");
    
        const data = response.data[0];
        if (data) {
            console.log("sitio encontrado");
            setPosUser([data.lat, data.lon]);
        } 
    };

    // fetch data de los eventos
    const getEventos = async () => {
        alert("Buscando eventos en " + lugar + " cierre este mensaje para continuar");
        const response = await axios.get(server + "/eventos?lugar=" + lugar.replace(/%20/g, "") + "&orderBy=desc" , {
            headers: {
                Authorization: localStorage.getItem("usuario"),
            },
        });

        geocode(lugar);

        console.log(response.data);

        // Guardar la colección en el estado
        setEventos(response.data);

        console.log(mapMarkers);
    }

    useEffect(() => {
        const token = localStorage.getItem("usuario");

        // Comprueba si el token es válido y si no lo es, redirige al login
        if (token) {
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
        } else {
            navigate("/");
        }
    }, []);

    const mapMarkers = 
        eventos.map((evento) => {
        if(evento.lat && evento.imagen && evento.lon ){
            return {
                location:{
                    lat: parseFloat(evento.lat),
                    long: parseFloat(evento.lon)
                },
                name: evento.nombre,
                img: evento.image,
            }
        }else{
            return null;
        }
    }).filter((evento) => {
        return evento != null;
    });

    return (
        <div className="map-page app-container">
            <h1>Cerca de ti</h1>
            <div className="card-body card">
                <p>Introduce un lugar para buscar eventos cerca de ti</p>
                <input
                    type="text"
                    onChange={(event) => setLugar(event.target.value)}
                />

                <button onClick={getEventos}>Buscar</button>

            </div>
            
            <Map
                pos = {posUser}
                zoom = {20}
                markers={mapMarkers}
            />

            {
                eventos && eventos.length > 0 &&
                <div >
                    <h2>Eventos encontrados cerca de ti</h2>
                    {/* Quiero que los elementos se muestren en tres columnas si es posible */}

                    <ul>
                        {
                            eventos.map((evento) => {
                                return (
                                    <div className="card body-card" style={{width:500, padding:20, marginBottom:20}}>
                                        <h3>{evento.nombre}</h3>
                                        <p>{evento.lugar}</p>
                                        <p>{evento.timestamp}</p>
                                        <p>{evento.organizador}</p>

                                        <img src={evento.imagen} style={{width:300, padding:20}}/>

                                        {
                                            user.email == evento.organizador ?
                                            <button className="btn btn-warning" onClick={() => navigate("/evento/" + evento._id)}>Editar</button>
                                            :
                                            <button className="btn btn-primary" onClick={() => navigate("/evento/" + evento._id)}>Ver</button>
                                        }
                                    </div>
                                )
                            })
                        }
                    </ul>
                </div>
            }
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
