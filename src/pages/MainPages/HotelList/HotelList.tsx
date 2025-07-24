import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { AuthContext, Hotel } from "../../../components/context/AuthContext";
import { useHistory } from "react-router";
import axios from "axios";
import HotelItem from "../../../components/HotelItem";
import "../../../components/UniversalCSS.css"

const HotelList: React.FC = () => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const goToHotels = () => {
        history.push("/newhotel");
    }
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/gethotels.php";
    const [hotels, setHotels] = useState<Array<Hotel>>([]);
    var [currPage, setCurrPage] = useState<number>(1);
    var maxPages = useRef(0);

    const getData = () => {
        const formdata = new FormData();
        formdata.append("page_no", currPage.toString() as string);
        axios.post(url, formdata).then((res) => {
            //console.log(res.data.t);
            setHotels(res.data.post);
            maxPages.current = Math.ceil(res.data.total);
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
                        <IonTitle className="pagetitle">Hotel List</IonTitle>
                    {authCtx?.user.is_admin == 1 && (
                        <div className="addHotelButton">
                            <IonButton onClick={goToHotels}>
                                <IonLabel>Add New Hotel</IonLabel>
                            </IonButton>
                        </div>
                    )}
                    </IonRow>
                    <IonRow>
                        <IonList>
                        {hotels.map((hotel, idx) => (
                            <HotelItem key={idx} hotel={hotel} fromProfile={0} />
                        ))}
                        </IonList>
                    </IonRow>
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
};

export default HotelList;