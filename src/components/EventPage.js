import { React, useEffect, useState } from "react";
import "../assets/css/imageUploader.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EventPage = ({ collection, validateToken, setUser, server, user }) => {
    const [imageFiles, setImageFiles] = useState([]);

    const [evento, setEvento] = useState([]); 
    const navigate = useNavigate();

    // Todo lo que se añada a la imagen
    const [nombre, setNombre] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [lugar, setLugar] = useState([]);
    const [organizador, setOrganizador] = useState("");
    const [imagen, setImagen] = useState("");

    const [imagenURI, setImagenURI] = useState("");

    const id = useParams().id;

    const getEvento = async () => {
        if (!id) {
            navigate("/my-profile");
            return;
        }

        const response = await axios.get(
            server + "/eventos/" + id,
            {
                headers: {
                    Authorization: localStorage.getItem("usuario"),
                },
            }
        );

        if (response.data) {
            setEvento(response.data);

            setNombre(response.data.nombre);
            setTimestamp(response.data.timestamp);
            setLugar(response.data.lugar);
            setOrganizador(response.data.organizador);
            setImagen(response.data.imagen);
        } else {
            navigate("/my-profile");
            return;
        }



    };

    useEffect(() => {
        const token = localStorage.getItem("usuario");
        // Comprueba si el token es válido y carga las imágenes si no lo es, redirige al login
        if (token) {
            validateToken(token).then((response) => {
                if (response) {
                    getEvento();
                } else {
                    localStorage.removeItem("usuario");
                    setUser(null);
                    navigate("/");
                }
            });
        }
    }, []);


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
                    alert("Evento eliminado correctamente");
                    navigate("/my-profile");
                } else {
                    localStorage.removeItem("usuario");
                    setUser(null);
                    navigate("/");
                }
            });
        }
    }

    const handleUpdate = async (event) => {
        event.preventDefault();

        // Crear la petición POST para subir el nuevo documento
        const response = await axios.put(
            server + "/eventos/" + id,
            {
                nombre: nombre,
                timestamp: timestamp,
                lugar: lugar,
                // imagen: (imagenURI ? imagenURI : "uploadNextStep"),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("usuario"),
                },
            }
        );

        // if (!imagenURI || imageFiles.length > 0) {
        //     // subir la foto a cloudinary y obtener la url
        //     if (!imagenURI) {
        //         const file = imageFiles[0];
        //         const formData = new FormData();
        //         formData.append("image", file);

        //         formData.append("folderName", id);
        //         formData.append("imageName", file.name);

        //         // Crear la petición POST para subir la imagen
        //         const response2 = await axios.post(
        //             server + "/cloudinary/images",
        //             formData,
        //             {
        //                 headers: {
        //                     "Content-Type": "multipart/form-data",
        //                     "Authorization": localStorage.getItem("usuario"),
        //                 },
        //             }
        //         );
        //         console.log(response2.data);
        //         console.log(id);

        //         // Con la URL de la imagen subida, añadirla a la colección
        //         await axios.put(
        //             server + "/eventos/" + id,
        //             {
        //                 image: response2.data.result.secure_url
        //             },
        //             {
        //                 headers: {
        //                     "Authorization": localStorage.getItem("usuario"),
        //                 },
        //             }
        //         );
        //     }
        // }

        if (response.status === 200) {
            alert("Evento actualizado correctamente");
            getEvento();
        }
    }

    return (
        <div className="app-container" style={{ marginTop: 50 }}>
            <div className="card card-body" style={{width:500, padding:20}} >

                {evento && evento.organizador === user.email ?
                    // editar evento
                    (
                        <div className="card-body">
                            <h2> {evento.organizador}</h2>
                            <img src={imagen} style={{width:300, padding:20}}/> 

                            <p>Nombre:{" "} </p>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(event) => setNombre(event.target.value)}
                            />


                            <br />

                            <p>Fecha:{" "}</p>
                            <input
                                type="date"

                                value={timestamp}
                                onChange={(event) => setTimestamp(event.target.value)}
                            />

                            <br />

                            <p>Lugar:{" "} </p>
                            <input
                                type="text"
                                value={lugar}
                                onChange={(event) => setLugar(event.target.value)}
                            />

                            <br />

                            <div style={{ marginTop: 50 }}>
                                <button className="btn btn-danger"
                                    onClick={(event) => handleDelete(event, evento._id)}
                                > Eliminar evento </button>

                                <button className="btn btn-success"
                                    onClick={handleUpdate}
                                > Editar evento </button>

                                <button className="btn btn-warning"
                                    onClick={() => navigate("/my-profile")}
                                > Cancelar </button>
                            </div>

                        </div>)
                    :
                    // ver evento
                    (<div className="card-body">

                        <h2> {evento.organizador}</h2>
                        <img src={evento.imagen} style={{width:300, padding:20}}/>
                        <p> {evento.nombre} </p>
                        <p> {evento.timestamp}</p>


                    </div>)
                }


            </div>
        </div>
    );
};

export default EventPage;
