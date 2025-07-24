import { IonButton, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonPage, IonRow, IonText, IonTitle, useIonViewWillEnter } from "@ionic/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import "./History.css";
import "../../../components/UniversalCSS.css"

interface Hist {
    id: number;
    user_id: number;
    username: string;
    hotel_id: number;
    hotelname: string;
    date: string;
}

const History: React.FC = () => {
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/gethistory.php";
    const [hist, setHist] = useState<Array<Hist>>();
    var [currPage, setCurrPage] = useState<number>(1);
    var maxPages = useRef(0);

    const getData = () => {
        const formdata = new FormData();
        formdata.append("page_no", currPage.toString() as string);
        axios.post(url, formdata).then((res) => {
            setHist(res.data.history);
            maxPages.current = res.data.total;
        });
    }
    useEffect(() => {
        getData();
    }, [currPage]);

    /*useIonViewWillEnter(() => {
        getData();
    });*/

    const nextPage = () => {
        setCurrPage(prev => prev + 1);
    }

    const prevPage = () => {
        setCurrPage(prev => prev - 1);
    }

    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonTitle className="pagetitle">History</IonTitle>
                    </IonRow>
                    <IonGrid>
                        <IonRow className="rowHeading">
                            <IonCol className="tableCol">Name</IonCol>
                            <IonCol className="tableCol">Hotel</IonCol>
                            <IonCol className="tableCol">Date</IonCol>
                        </IonRow>
                        {hist?.map((h, idx) => (
                            <IonRow key={idx}>
                                <IonCol className="tableCol">{h.username}</IonCol>
                                <IonCol className="tableCol">{h.hotelname}</IonCol>
                                <IonCol className="tableCol">{h.date}</IonCol>
                            </IonRow>
                        ))}
                    </IonGrid>
                    <IonRow className="pagination-component">
                                            <IonButton
                                                onClick={() => prevPage()}
                                                disabled={currPage === 1 ? true : false}
                                            >
                                                <IonLabel>{"< PREV"}</IonLabel>
                                            </IonButton>
                                            <IonText className="pagination-text">
                                                {`Page ${currPage}/${maxPages.current}`}
                                            </IonText>
                                            <IonButton
                                                onClick={() => nextPage()}
                                                disabled={currPage === maxPages.current ? true : false}
                                            >
                                                <IonLabel>{"NEXT >"}</IonLabel>
                                            </IonButton>
                                        </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default History;