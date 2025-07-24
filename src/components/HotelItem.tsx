import { IonAlert, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonText } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext, Hotel } from "./context/AuthContext";
import {chevronForward, pencil, star, trash, trashBin} from "ionicons/icons";
import "./HotelItem.css";
import { useHistory } from "react-router";

interface HotelProps {
    hotel: Hotel;
    fromProfile: number;
    onDelete?: (hotelId: number) => void;
}

const HotelItem: React.FC<HotelProps> = (props) => {
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const handleDelClick = () => {
        setShowDeleteAlert(true);
    };
    const deleteurl = "/backend/deletehotel.php";
    const deleteHotel = async () => {
        const formdata = new FormData();
        formdata.append("hotel_id", props.hotel.id.toString());

        try {
            const resp = await axios.post(deleteurl, formdata);
            if(resp.data.success) {
                console.log("The hotel has been successfully deleted");
                props.onDelete?.(props.hotel.id);
                window.location.reload();
            } else {
                console.log("Deletion failure");
            }
        } catch (error) {
            console.log("There was an error");
        }
    };

    const [isLargeSize, setIsLargeSize] = useState(window.innerWidth > 1000);
        const updateSize = () => {
            setIsLargeSize(window.innerWidth > 1000);
        }
        useEffect(() => {
            window.addEventListener("resize", updateSize);
            return () => window.removeEventListener("resize", updateSize);
        });

    const goToHotelDetails = (hotelId: number) => {
        history.push(`/hoteldetails/${hotelId}`);
    }

    const goToEditHotel = (hotelId: number) => {
        history.push(`/edithotel/${hotelId}`);
    }
    return(
        <>
            <IonItem>
                <IonGrid>
                <IonRow>
                    {isLargeSize && <IonCol size="3">
                        <img 
                            src={`/backend/${props.hotel.image}`} 
                            className="hotelimg-list"
                        />
                    </IonCol>}
                    <IonCol>
                        <IonRow>
                            <IonLabel className="texthotelname-list">{props.hotel.name}</IonLabel>
                        </IonRow>
                        <IonRow style={{marginTop: 7, marginBottom: 7}}>
                            {Array(props.hotel.class).fill("e").map((_, idx) => (
                                <IonIcon icon={star} key={idx}/>
                            ))}
                            {props.fromProfile === 1 &&
                                <IonText>
                                    {props.hotel.hist_date !== undefined && ` | recommendation got on ${props.hotel.hist_date}`}
                                </IonText>
                            }
                        </IonRow>
                        <IonRow>
                            <IonText class="texthoteladd-list">{props.hotel.address}</IonText>
                        </IonRow>
                    </IonCol>
                    {props.fromProfile === 0 &&
                    <IonCol size={isLargeSize ? "1" : "2"}>
                        <a 
                            href={`/hoteldetails/${props.hotel.id}`} 
                            className="menu-item-text" 
                            onClick={(e) => {e.preventDefault();}}
                        >
                            <div
                                className="hotelitem-goToButton"
                                onClick={() => goToHotelDetails(props.hotel.id)}
                            >
                                <IonText className="hotelitem-menutext">
                                    {isLargeSize && "Details"}
                                    <IonIcon icon={chevronForward} className="hotelitem-menutexticon" />
                                </IonText>
                            </div>
                        </a>
                        {authCtx?.user.is_admin == 1 && (
                            <>
                            <a 
                                href={`/edithotels/${props.hotel.id}`} 
                                className="menu-item-text" 
                                onClick={(e) => {e.preventDefault();}}
                            >
                                <div
                                    className="hotelitem-goToButton"
                                    onClick={() => goToEditHotel(props.hotel.id)}
                                >
                                    <IonText className="hotelitem-menutext">
                                        {isLargeSize && "Edit"}
                                        <IonIcon icon={pencil} className="hotelitem-menutexticon" />
                                    </IonText>
                                </div>
                            </a>
                            <a 
                                href=""
                                className="menu-item-text" 
                                onClick={(e) => {e.preventDefault();}}
                            >
                                <div
                                    className="hotelitem-goToButton"
                                    onClick={() => handleDelClick}
                                >
                                    <IonText className="hotelitem-menutext">
                                        {isLargeSize && "Delete"}
                                        <IonIcon icon={trash} className="hotelitem-menutexticon" />
                                    </IonText>
                                </div>
                            </a>
                            </>
                        )}
                    </IonCol>}
                </IonRow>
                </IonGrid>
            </IonItem>
            <IonAlert 
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header={"Confirm delete"}
                message={"Are you sure you want to delete this hotel?"}
                buttons={[
                    {
                        text: "No",
                        role: "cancel",
                        handler: () => setShowDeleteAlert(false),
                    },
                    {
                        text: "Yes",
                        handler: deleteHotel,
                    }
                ]}
            />
        </>
    );
}

export default HotelItem;