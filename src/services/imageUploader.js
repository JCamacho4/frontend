import React from "react";
import { useDropzone } from "react-dropzone";
import "../assets/css/imageUploader.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

const ImageUploader = ({
    imageFiles,
    setImageFiles,
    validateToken,
    setUser,
    server,
}) => {
    // const navigate = useNavigate();

    const onDrop = (acceptedFiles) => {
        // Añadir nuevas imagenes al array de imagenes
        setImageFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const removeImage = (index, event) => {
        event.preventDefault();
        event.stopPropagation();

        // Eliminar la imagen del array de imagenes
        const newImageFiles = [...imageFiles];
        newImageFiles.splice(index, 1);
        setImageFiles(newImageFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
        },
    });


    return (
        <div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drop or select Images here!</p>
                <div className="preview-container">
                    {imageFiles.map((file, index) => (
                        <div key={file.name} className="image-preview">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="preview-image"
                            />
                            <button
                                onClick={(event) => removeImage(index, event)}
                                className="delete-button"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
