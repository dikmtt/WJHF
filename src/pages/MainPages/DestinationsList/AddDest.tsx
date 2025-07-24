import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle } from "@ionic/react";
import React, { useState } from "react";
import Header from "../../../components/Header";
import axios from "axios";
import { useHistory } from "react-router";

const AddDest: React.FC = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [image, setImage] = useState<File>();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setImage(event.target!.files![0]);
    }
    const history = useHistory();

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/addnewdest.php";
    const submit = () => {
        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("type", type);
        formdata.append("lat", lat.toString());
        formdata.append("lng", lng.toString());
        formdata.append("image", image as File);
        axios.post(url, formdata).then((res) => {
            console.log(res.data);
        });
        history.goBack();
    }

    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonTitle className="pagetitle">Add New Destination</IonTitle>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonRow>
                                <IonInput
                                    fill="outline"
                                    label="Name"
                                    labelPlacement="floating"
                                    className="newhotel-input"
                                    onIonChange={(e) => setName(e.detail.value!)}
                                ></IonInput>
                            </IonRow>
                            <IonRow>
                                <IonInput
                                    fill="outline"
                                    label="Type"
                                    labelPlacement="floating"
                                    className="newhotel-input"
                                    onIonChange={(e) => setType(e.detail.value!)}
                                ></IonInput>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Latitude"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setLat(parseFloat(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Longitude"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setLng(parseFloat(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow className="newhotel-imageinput">
                                <IonCol>
                                    <IonLabel className="newhotel-imagetext">Image:</IonLabel>
                                </IonCol>
                                <IonCol>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </IonCol>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <IonRow className="submitbutton">
                        <IonButton onClick={submit}>
                            <IonLabel>Submit</IonLabel>
                        </IonButton>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default AddDest;