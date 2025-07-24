import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Hotel } from "../../../components/context/AuthContext";
import axios from "axios";
import { IonPage, IonContent, IonGrid, IonCol, IonTitle, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonRow } from "@ionic/react";
import Header from "../../../components/Header";

const EditHotel: React.FC = () => {
    const hotelId = useParams<{hotelId: string}>().hotelId;
    const [hotel, setHotel] = useState<Hotel>();
    const history = useHistory();
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const geturl = "/backend/getsinglehotel.php";
    useEffect(() => {
        const formdata = new FormData();
        formdata.append("hotelId", hotelId as string);
        axios.post(geturl, formdata).then((res) => {
            setHotel(res.data.post);
            setName(res.data.post.name);
            setAddress(res.data.post.address);
            setHotelClass(res.data.post.class);
            setPrice(res.data.post.price);
            setHasWifi(res.data.post.hasWifi);
            setHasResto(res.data.post.hasResto);
            setHasPool(res.data.post.hasPool);
            setDesc(res.data.post.desc);
            setLat(res.data.post.lat);
            setLng(res.data.post.lng);
            setOldImg(res.data.post.image);
        })
    }, []);
    
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [hotelClass, setHotelClass] = useState(0);
    const [price, setPrice] = useState(0);
    const [hasWifi, setHasWifi] = useState(0);
    const [hasResto, setHasResto] = useState(0);
    const [hasPool, setHasPool] = useState(0);
    const [desc, setDesc] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [img, setImg] = useState<File>();
    const [oldImg, setOldImg] = useState("");

    const handleDescChange = (event: CustomEvent) => {
        setDesc(event.detail.value);
    };
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImg(event.target!.files![0]);
    }

    const urledit = "/backend/edithotel.php";
    const submit = () => {
        console.log(img);
        console.log(oldImg);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("class", hotelClass.toString());
        formData.append("price", price.toString());
        formData.append("hasWifi", hasWifi.toString());
        formData.append("hasResto", hasResto.toString());
        formData.append("hasPool", hasPool.toString());
        formData.append("description", desc);
        formData.append("lat", lat.toString());
        formData.append("lng", lng.toString());
        if(img === undefined) {
            formData.append("oldimg", hotel?.image as string);
        } else {
            formData.append("image", img as File);
        }
        formData.append("hotelId", hotelId);
        console.log(formData);

        axios.post(urledit, formData).then((res) => {
            console.log(res.data);
        });
        history.goBack();
    };
    
    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonTitle className="pagetitle">Edit Hotel</IonTitle>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonRow>
                                <IonInput
                                    fill="outline"
                                    label="Name"
                                    labelPlacement="floating"
                                    className="newhotel-input"
                                    value={name}
                                    onIonChange={(e) => setName(e.detail.value!)}
                                ></IonInput>
                            </IonRow>
                            <IonRow>
                                <IonInput
                                    fill="outline"
                                    label="Address"
                                    labelPlacement="floating"
                                    className="newhotel-input"
                                    value={address}
                                    onIonChange={(e) => setAddress(e.detail.value!)}
                                ></IonInput>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        min="1"
                                        max="5"
                                        fill="outline"
                                        label="Class (1-5)"
                                        labelPlacement="floating"
                                        value={hotelClass}
                                        onIonChange={(e) => setHotelClass(parseInt(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Price"
                                        labelPlacement="floating"
                                        value={price}
                                        onIonChange={(e) => setPrice(parseInt(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonSelect
                                        interface="popover"
                                        placeholder="select"
                                        fill="outline"
                                        label="Wi-Fi?"
                                        labelPlacement="floating"
                                        value={hasWifi}
                                        onIonChange={(e) => setHasWifi(parseInt(e.detail.value!))}
                                    >
                                        <IonSelectOption value={0}>No</IonSelectOption>
                                        <IonSelectOption value={1}>Yes</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                                <IonCol>
                                    <IonSelect
                                        interface="popover"
                                        placeholder="select"
                                        fill="outline"
                                        label="Restaurant?"
                                        labelPlacement="floating"
                                        value={hasResto}
                                        onIonChange={(e) => setHasResto(parseInt(e.detail.value!))}
                                    >
                                        <IonSelectOption value={0}>No</IonSelectOption>
                                        <IonSelectOption value={1}>Yes</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                                <IonCol>
                                    <IonSelect
                                        interface="popover"
                                        placeholder="select"
                                        fill="outline"
                                        label="Pool?"
                                        labelPlacement="floating"
                                        value={hasPool}
                                        onIonChange={(e) => setHasPool(parseInt(e.detail.value!))}
                                    >
                                        <IonSelectOption value={0}>No</IonSelectOption>
                                        <IonSelectOption value={1}>Yes</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonTextarea
                                    fill="outline"
                                    value={desc}
                                    onIonChange={handleDescChange}
                                    rows={3}
                                    label="Description"
                                    className="newhotel-input"
                                    labelPlacement="floating"
                                ></IonTextarea>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Latitude"
                                        labelPlacement="floating"
                                        value={lat}
                                        onIonChange={(e) => setLat(parseFloat(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Longitude"
                                        labelPlacement="floating"
                                        value={lng}
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

export default EditHotel;