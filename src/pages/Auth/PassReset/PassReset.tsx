import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonLabel, IonPage, IonRow, IonText, IonTitle, IonToast } from "@ionic/react";
import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const PassReset: React.FC = () => {
    const [email, setEmail] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [emailSumbitted, setEmailSubmitted] = useState(false);
    
    const [showToast, setShowToast] = useState(false);
    const [toastMess, setToastMess] = useState("");
    const history = useHistory();
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/resetpassword.php";

    //regex to check valid email
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //regex to check valid password: at least 8 characters and includes letters and numbers
    const passwordCheck = /^(?=.*[a-zA-z])(?=.*\d).{8,}$/;

    const submit = () => {
        if(!emailSumbitted) {
            if(!email) {
                setToastMess("Please input your email");
                setShowToast(true);
                return;
            }
    
            if(!emailCheck.test(email)) {
                setToastMess("Invalid email format");
                setShowToast(true);
                return;
            }

            const formdata = new FormData();
            formdata.append("email", email);
            formdata.append("isfirstsubmit", "0");

            axios.post(url, formdata)
            .then((res) => {
                console.log("Response:", res.data);
                if(res.data.user_exists === 1) {
                    setToastMess("Email exists");
                    setShowToast(true);
                    setEmailSubmitted(true);
                } else {
                    setToastMess("Email not found");
                    setShowToast(true);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
                setToastMess("Error during registration");
                setShowToast(true);
            });
        } else {
            if(!email || !pass1 || !pass2) {
                setToastMess("There are some empty fields");
                setShowToast(true);
                return;
            }
    
            if(!emailCheck.test(email)) {
                setToastMess("Invalid email format");
                setShowToast(true);
                return;
            }
    
            if(!passwordCheck.test(pass1)) {
                setToastMess("Password must be at least 8 characters long and contain letters and numbers");
                setShowToast(true);
                return;
            }
    
            if(pass1 !== pass2) {
                setToastMess("Passwords do not match");
                setShowToast(true);
                return;
            }

            const formdata = new FormData();
            formdata.append("email", email);
            formdata.append("password", pass1);
            formdata.append("isfirstsubmit", "1");

            axios.post(url, formdata)
            .then((res) => {
                console.log("Response:", res.data);
                if(res.data.success) {
                    setToastMess("Password change done!");
                    setShowToast(true);
                    setEmailSubmitted(true);
                    setTimeout(() => history.push("/login"), 3000);
                } else {
                    setToastMess("Password change failed");
                    setShowToast(true);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
                setToastMess("Error during registration");
                setShowToast(true);
            });
        }
    }
    return(
        <IonPage>
            <IonContent>
                <div className="flex-container">
                        <IonGrid class="auth-grid">
                            <IonCol class="auth-col">
                                <IonRow class="center-stuff">
                                    <IonTitle class="auth-title">Reset Password</IonTitle>
                                </IonRow>
                                <IonRow>
                                        <IonLabel class="auth-label">Email:</IonLabel>
                                        <IonInput
                                            class="auth-input"
                                            color={"secondary"}
                                            value={email}
                                            onIonChange={(e) => setEmail(e.detail.value!)}
                                            disabled={emailSumbitted ? true : false}
                                            placeholder="Email"></IonInput>
                                    </IonRow>
                                    {emailSumbitted && 
                                    <>
                                    <IonRow>
                                        <IonLabel class="auth-label">New Password:</IonLabel>
                                        <IonInput
                                            class="auth-input"
                                            color={"secondary"}
                                            type="password"
                                            value={pass1}
                                            onIonChange={(e) => setPass1(e.detail.value!)}
                                            placeholder="Password"
                                            style={{marginBottom: "5px"}}></IonInput>
                                        <IonLabel style={{fontSize: "10px", margin: "1px", marginBottom: "3px"}}>
                                            Must have at least 8 characters, 1 letter and 1 number
                                        </IonLabel>
                                    </IonRow>
                                    <IonRow>
                                        <IonLabel class="auth-label">Re-enter New Password:</IonLabel>
                                        <IonInput
                                            class="auth-input"
                                            color={"secondary"}
                                            type="password"
                                            value={pass2}
                                            onIonChange={(e) => setPass2(e.detail.value!)}
                                            placeholder="Password"></IonInput>
                                    </IonRow>
                                    </>}
                                    <IonRow class="center-stuff">
                                        <IonButton onClick={submit} color={"secondary"}>Submit</IonButton>
                                    </IonRow>
                            </IonCol>
                        </IonGrid>
                </div>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMess}
                    duration={3000}
                />
            </IonContent>
        </IonPage>
    );
}

export default PassReset;