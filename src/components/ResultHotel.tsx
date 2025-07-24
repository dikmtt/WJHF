import { IonButton, IonCol, IonGrid, IonIcon, IonLabel, IonPage, IonRow } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { Hotel } from "./context/AuthContext";
import { cafe, fish, star, wifi } from "ionicons/icons";

interface ResHotelProps {
    hotel: Hotel;
    rank: number;
}

const ResultHotel: React.FC<ResHotelProps> = (props) => {
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const history = useHistory();
    const goToHotelDetails = () => {
        localStorage.removeItem("weights");
        history.push(`/hoteldetails/${props.hotel.id}`);
    }
    return(
        <IonGrid>
            <IonCol className="hotelres-bg">
                <IonRow className="hotelRank hotelres-comp">
                    <IonLabel>{props.rank + 1}</IonLabel>
                </IonRow>
                <IonRow>
                    <img 
                        className="hotelres-img hotelres-comp"
                        src={`/backend/${props.hotel.image}`}
                    />
                </IonRow>
                <IonRow className="hotelName hotelres-comp">
                    <IonLabel>{props.hotel.name}</IonLabel>
                </IonRow>
                <IonRow className="hotelres-comp hotelres-price">
                    <IonLabel>Rp {props.hotel.price.toLocaleString()}</IonLabel>
                </IonRow>
                <IonRow className="hotelres-comp hotelres-price">
                    <IonLabel className="hotelres-icon">{props.hotel.class} <IonIcon icon={star} className="hotelres-iconinner"/></IonLabel>
                    {props.hotel.hasWifi ? (<IonLabel className="hotelres-icon"> | <IonIcon icon={wifi} className="hotelres-iconinner" /></IonLabel>) : <></>}
                    {props.hotel.hasResto ? (<IonLabel className="hotelres-icon"> | <IonIcon icon={cafe} className="hotelres-iconinner"/></IonLabel>) : <></>}
                    {props.hotel.hasPool ? (<IonLabel className="hotelres-icon"> | <IonIcon icon={fish} className="hotelres-iconinner"/></IonLabel>) : <></>}
                </IonRow>
                <IonRow>
                    <IonButton onClick={goToHotelDetails}>
                        <IonLabel>View Details</IonLabel>
                    </IonButton>
                </IonRow>
            </IonCol>
        </IonGrid>
    );
}

export default ResultHotel