import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Login = ({ user, setUser, validateToken, server }) => {


    const client_id =
        "103009627553-g0gfh9bpp723qg23b9ppc4rsolgv9m5b.apps.googleusercontent.com";

    function handleCredentialResponse(response) {
        // Valida con Google cuando inicia sesión
        if (validateToken(response.credential)) {

            // Guarda el token en el localStorage decodificado
            localStorage.setItem("usuario", response.credential);
            const userObject = jwtDecode(response.credential);
            setUser(userObject);

            // Obtiene los tiempos de expiración del token
            const timestamp = new Date(0);
            timestamp.setUTCSeconds(userObject.iat);
            const exp = new Date(0);
            exp.setUTCSeconds(userObject.exp);


            // Si ya está el cliente en la base de datos actualizo datos, si no, lo creo
            axios.get(server + "/clientes/?googleId" + userObject.sub, {
                headers: {
                    Authorization: client_id,
                },
            }).then(async (resDB) => {                
                // check the diference between the exp in the database and the exp in the token
                console.log(resDB.data)
                console.log(resDB.data.length);
                console.log(jwtDecode(response.credential));
                if (resDB && resDB.data.length > 0) {

                    await axios.put(server + "/clientes/" + resDB.data[0].googleId, {
                        timestamp: timestamp,
                        exp: exp,
                        token: response.credential,
                    }, {
                        headers: {
                            Authorization: client_id,
                        },
                    });

                    return
                }else{
                    // Create a new client on the database
                    axios.post(server + "/clientes", {
                        timestamp: timestamp,
                        email: userObject.email,
                        exp: exp,
                        token: response.credential,
                        googleId: userObject.sub,
                        lat: 36.7201600,    // Dirección por defecto
                        long: -4.4203400,
                    }, {
                        headers: {
                            Authorization: client_id,
                        },
                    });
                }
            });

        } else {
            alert("Error al iniciar sesión");
        }
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: client_id,
            callback: handleCredentialResponse,
        });

        google.accounts.id.renderButton(document.getElementById("g_id_onload"), {
            theme: "outline",
            size: "large",
            text: "login_with",
            shape: "rectangular",
        });
    });

    return (
        <div>
            <div className="signInPetition-container">
                <div className="signInPetition">
                    <>
                        <h1>Google Sign In</h1>
                        <p>
                            Para continuar a la aplicacion inicia sesión con tu cuenta de
                            google
                        </p>
                    </>
                    <div id="g_id_onload" className="loginButton"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
