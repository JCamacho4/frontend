import { React, useEffect, useState } from "react";
import "../assets/css/imageUploader.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ImageGetter = ({ collection, validateToken, setUser, server, user }) => {
    const [allImages, setAllImages] = useState([]); // Array de todas las imágenes
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const getImages = async () => {
        console.log(server + "/eventos/" + (collection ? collection : ""));

        const response = await axios.get(
            server + "/eventos/" + (collection ? collection : ""),
            {
                headers: {
                    Authorization: localStorage.getItem("usuario"),
                },
            }
        );

        // Guardar la colección en el estado
        setAllImages(response.data);
        setImages(response.data);
    };

    useEffect(() => {
        const token = localStorage.getItem("usuario");
        // Comprueba si el token es válido y carga las imágenes si no lo es, redirige al login
        if (token) {
            validateToken(token).then((response) => {
                if (response) {
                    getImages();
                } else {
                    localStorage.removeItem("usuario");
                    setUser(null);
                    navigate("/");
                }
            });
        }
    }, []);



    const handleGet = () => {
        // Filtrar las imágenes por la colección
        if (collection) {
            setImages(allImages.filter((image) => image.anfitrion.includes(collection)));
        } else {
            setImages(allImages);
        }
        
    };

    const handleDelete = async (event, id) => {
        event.preventDefault();

        const token = localStorage.getItem("usuario");
        // Comprueba si el token es válido y carga las imágenes si no lo es, redirige al login
        if (token) {
            validateToken(token).then((response) => {
                if (response) {
                    axios.delete(server + "/eventos/" + id, {
                        headers: {
                            Authorization: localStorage.getItem("usuario"),
                        },
                    });
                    getImages();
                } else {
                    localStorage.removeItem("usuario");
                    setUser(null);
                    navigate("/");
                }
            });
        }
    }

    return (
        <div>
            <button onClick={handleGet}>Get</button>
            {images.map((evento, index) => (
                <div className="card" key={index} style={{marginTop: 50, padding:10}}>
                    <div className="card-body">
                        {
                            evento.anfitrion === user.email &&
                            <button className="btn btn-danger" onClick={(event) => handleDelete(event, evento._id)}>Delete</button>
                        }
                        <p> Anfitrión: {evento.anfitrion}</p>
                        <p> descripción: {evento.descripcion} </p>
                        {
                            evento.images && evento.images.map((image, index) => (
                                <img style={{ width: 100 }} key={index} src={image.secure_url} alt={image} />
                            ))
                        }
                        <br />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGetter;
