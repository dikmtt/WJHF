import React, { useContext, useEffect, useState } from "react";
import { AuthContext, Hotel } from "../../../components/context/AuthContext";
import { useHistory, useLocation } from "react-router";
import axios from "axios";
import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonPage, IonRow, IonTitle } from "@ionic/react";
import Header from "../../../components/Header";

import "./FinalRec.css";
import ResultHotel from "../../../components/ResultHotel";

interface HotelIDProps {
    hotelID: number;
}

type HotelState = {
    bestHotelList?: string;
}

const FinalRec: React.FC<HotelIDProps> = (props) => {
    const location = useLocation();
    const h = location.state as HotelState;
    //console.log("json hotels get: ", h?.bestHotelList!);
    //const bestHotels2 = JSON.parse(h?.bestHotelList!);
    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const [isDone, setIsDone] = useState(false);

    const [hotel, setHotel] = useState<Hotel>();
    const [hotels, setHotels] = useState<Array<Hotel>>([]);

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const saveurl = "/backend/savehistory.php";
    useEffect(() => {
        //if(!isDone) {
            const formdata2 = new FormData();
            formdata2.append("userId", authCtx?.user.id.toString() as string);
            formdata2.append("hotelIds", h?.bestHotelList! as string);
            axios.post(saveurl, formdata2).then((res) => {
                console.log(res.data);
                setHotels(res.data.post);
            });
            //setIsDone(true);
        //}
    }, []);

    const backToHome = () => {
        localStorage.removeItem("weights");
        history.push("/home");
    }

    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid className="mainarea hehe">
                    <IonCol className="hehe">
                        <IonRow className="maincol">
                            <IonTitle className="resulttitle">Your recommendations</IonTitle>
                        </IonRow>
                        <IonRow className="maincol">
                            <div className="besthotel-area">
                                {hotels.map((hotel, idx) => (
                                    <ResultHotel hotel={hotel} rank={idx} />
                                ))}
                            </div>
                        </IonRow>
                        <IonRow className="maincol res-buttonsArea">
                            <IonButton color={"tertiary"} onClick={backToHome}>
                                <IonLabel>Back to Home</IonLabel>
                            </IonButton>
                        </IonRow>
                    </IonCol>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default FinalRec;