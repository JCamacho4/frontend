import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ImageUploader from "../services/imageUploader";


import axios from "axios";

function NewEvent({ user, setUser, validateToken, server }) {
    const navigate = useNavigate();


    // Imagenes subidas
    const [imageFiles, setImageFiles] = useState([]);

    // Todo lo que se añada a la imagen
    const [nombre, setNombre] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [lugar, setLugar] = useState("");

    const [imagenURI, setImagenURI] = useState("");



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

    const handleCreate = async (event) => {
        event.preventDefault();

        console.log(user);

        // Crear la petición POST para subir el nuevo documento
        const response = await axios.post(
            server + "/eventos",
            {
                nombre: nombre,
                timestamp: timestamp,
                lugar: lugar,
                organizador: user.email,
                imagen: (imagenURI ? imagenURI : "uploadNextStep"),
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

        // Subir solamente la primera imagen del array de imagenes, si es que no se ha indicado imagenURI

        if(imageFiles.length > 0){
            const file = imageFiles[0];
            const formData = new FormData();
            formData.append("image", file);
    
            formData.append("folderName", id);
            formData.append("imageName", file.name);
    
            // Crear la petición POST para subir la imagen
            const response2 = await axios.post(
                server + "/cloudinary/images",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": localStorage.getItem("usuario"),
                    },
                }
            );
            console.log(response2.data);
            console.log(id);
    
            // Con la URL de la imagen subida, añadirla a la colección
            await axios.put(
                server + "/eventos/" + id,
                {
                    imagen: response2.data.result.secure_url
                },
                {
                    headers: {
                        "Authorization": localStorage.getItem("usuario"),
                    },
                }
            );
        }


        navigate("/my-profile");
    }

    return (
        <div className="app-container">
            <h1>Nuevo evento</h1>
            <h2>Rellena los campos y crea el evento</h2>

            <div className="card card-body">
                Nombre :{" "}
                <input
                    type="text"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                />


                <br />

                Fecha: {" "}
                <input
                    type="date"
                    value={timestamp}
                    onChange={(event) => setTimestamp(event.target.value)}
                />

                <br />

                Lugar:{" "}
                <input
                    type="text"
                    value={lugar}
                    onChange={(event) => setLugar(event.target.value)}
                />

                <br />



                <ImageUploader
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    validateToken={validateToken}
                    setUser={setUser}
                    server={server}
                />

                <p>Si no quieres subir una imagen puedes poner una URI direcatamente! </p>
                <input
                    type="text"
                    value={imagenURI}
                    onChange={(event) => setImagenURI(event.target.value)}
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

export default NewEvent;
