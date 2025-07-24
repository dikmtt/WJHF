import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonPage, IonRow, IonTitle, useIonViewWillEnter } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { AuthContext, Dest } from "../../../components/context/AuthContext";
import { useHistory } from "react-router";
import axios from "axios";
import DestItem from "../../../components/DestItem";
import "../../../components/UniversalCSS.css";

const DestinationsList: React.FC = () => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const goToNewDest = () => {
        history.push("/newdest");
    }

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/getdestinations.php";
    const [dests, setDests] = useState<Array<Dest>>([]);

    const getData = () => {
        axios.get(url).then((res) => {
            setDests(res.data.dest);
        })
    }

    useEffect(() => {
        getData();
    }, []);

    useIonViewWillEnter(() => {
        getData();
    });
    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonTitle className="pagetitle">List of Destinations</IonTitle>
                    {authCtx?.user.is_admin == 1 && (
                        <div className="addHotelButton">
                            <IonButton onClick={goToNewDest}>
                                <IonLabel>Add New Destination</IonLabel>
                            </IonButton>
                        </div>
                    )}
                    </IonRow>
                    <IonRow>
                    {dests.map((dest, idx) => (
                        <IonCol sizeLg="4" sizeMd="6" sizeSm="6">
                            <DestItem key={idx} dest={dest} />
                        </IonCol>
                    ))}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default DestinationsList;