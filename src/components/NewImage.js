import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ImageUploader from "../services/imageUploader";

import axios from "axios";

function NewImage({ user, setUser, validateToken, server }) {
    const navigate = useNavigate();


    // Imagenes subidas
    const [imageFiles, setImageFiles] = useState([]);

    // Todo lo que se añada a la imagen
    const [descripcion, setDescripcion] = useState("");
    const [inicio, setInicio] = useState("");
    const [invitados, setInvitados] = useState([]);
    const [duracion, setDuracion] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");


    const [lastInvitado, setLastInvitado] = useState("");



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
        } else {
            navigate("/");
        }
    }, []);

    const removeInvitado = (invitado, event) => {
        event.preventDefault();
        setInvitados(invitados.filter((item) => item !== invitado));
    }

    const handleCreate = async (event) => {
        event.preventDefault();

        console.log(user);

        // Crear la petición POST para subir el nuevo documento
        const response = await axios.post(
            server + "/eventos",
            {
                anfitrion: user.email,
                descripcion: descripcion,
                inicio: inicio,
                invitados: invitados,
                images: " DESPUES ",
                duracion: parseInt(duracion),
                coordenadas:
                {
                    lat: lat,
                    long: long
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("usuario"),
                },
            }
        );

        const id = response.data.insertedId;
        console.log(response.data);

        // Bucle para subir cada imagen a cloudinary, y añadir la "secure_url" a la colección
        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append("image", file);

            formData.append("folderName", id);
            formData.append("imageName", file.name);

            // Crear la petición POST para subir la imagen
            const response = await axios.post(
                server + "/cloudinary/images",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": localStorage.getItem("usuario"),
                    },
                }
            );

            console.log(response.data);

            console.log(id);

            // Con la URL de la imagen subida, añadirla a la colección
            await axios.put(
                server + "/eventos/" + id + "/addImage",
                {
                    image: {
                        secure_url: response.data.result.secure_url,
                        public_id: response.data.result.public_id
                    }
                },
                {
                    headers: {
                        "Authorization": localStorage.getItem("usuario"),
                    },
                }
            );
        }


        navigate("/");
    }

    return (
        <div className="app-container">
            <h1>Nuevo post</h1>
            <h2>Sube las imágenes que quieras y añade una descripcion</h2>

            <div className="card card-body">
                descripcion:{" "}
                <input
                    type="text"
                    value={descripcion}
                    onChange={(event) => setDescripcion(event.target.value)}
                />

                <div className="card">
                    <div className="card-body">
                        <p>Introduce las coordenadas del evento</p>

                        {/* Campos para controlar la lat y long, permitiendo solo valores posibles*/}
                        lat:{" "}
                        <input
                            type="number"
                            value={lat}
                            onChange={(event) => setLat(event.target.value)}
                            min="-90"
                            max="90"
                        />
                        long:{" "}
                        <input
                            type="number"
                            value={long}
                            onChange={(event) => setLong(event.target.value)}
                            min="-180"
                            max="180"
                        />
                    </div>
                </div>

                <br />

                inicio:{" "}
                <input
                    type="date"
                    value={inicio}
                    onChange={(event) => setInicio(event.target.value)}
                />

                <br />

                duracion:{" "}
                <input
                    type="number"
                    value={duracion}
                    onChange={(event) => setDuracion(event.target.value)}
                />

                <br />

                invitados:{" "}

                {/* un campo de texto donde se pueden ir añadiendo correos y eliminando */}
                <div>
                    <input
                        type="text"
                        value={lastInvitado}
                        onChange={(event) => setLastInvitado(event.target.value)}
                    />
                    <button className="btn btn-primary"
                        onClick={(event) => {
                            event.preventDefault();
                            setInvitados([...invitados, lastInvitado]);
                            setLastInvitado("");
                        }}
                    > Añadir invitado </button>
                </div>

                <br />

                <div>

                    {invitados.map((invitado, index) => {
                        return (
                            <div key={index}>
                                {invitado}

                                <button
                                    onClick={(event) => removeInvitado(invitado, event)}
                                    className="btn btn-danger"
                                >
                                    Eliminar invitado
                                </button>
                            </div>
                        );
                    })}
                </div>


                <ImageUploader
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    validateToken={validateToken}
                    setUser={setUser}
                    server={server}

                    descripcion={descripcion}
                    inicio={inicio}
                    invitados={invitados}


                />

            </div>

            {/* un boton con el que al hacer click tenga una funcion que controle la subida del nuevo evento */}
            <button className="btn btn-success"
                onClick={handleCreate}
            >
                Crear evento{" "}
            </button>

        </div>
    );
}

export default NewImage;
