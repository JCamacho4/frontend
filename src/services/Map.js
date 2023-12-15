import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Map = (props) => {
    const defaultPosition = [36.602274, -4.531727];

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        // Establezco los marcadores obtenidos de MapPage y la posición inicial
        setMarkers(props.markers);
    }, [props]);

    return (
        <div className="map-container-container">
            <div className="map-container">
                <MapContainer
                    className="map"
                    center={props.pos ? props.pos : defaultPosition}
                    zoom={10}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {markers.map((marker, id) => {
                        return (
                            <Marker
                                key={id}
                                position={[marker.location.lat, marker.location.long]}
                            >
                                <Popup>
                                    <h2>{marker.name}</h2>
                                    <p>{marker.description}</p>
                                    <img style={{width:200}} src={marker.img}></img>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default Map;
