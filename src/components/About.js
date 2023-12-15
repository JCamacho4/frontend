import ImageGetter from "../services/ImageGetter";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


const MainPage = ({ user, setUser, server, validateToken }) => {
    
    useEffect(() => {         
    }, []);

    return (
        <div className="app-container">
            <h1> Aplicación web desarrollada</h1>

    
            
        </div>
    );
};

export default MainPage;
