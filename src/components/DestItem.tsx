import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import React from "react";
import { Dest } from "./context/AuthContext";
import './DestItem.css';

interface DestProps {
    dest: Dest;
}

const DestItem: React.FC<DestProps> = (props) => {
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    return(
        <IonCard>
            <img 
                src={`/backend/${props.dest.image}`} 
                className="image-dest"
            />
            <IonCardHeader>
                <IonCardTitle>{props.dest.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>{props.dest.type}</p>
            </IonCardContent>
        </IonCard>
    );
}

export default DestItem;