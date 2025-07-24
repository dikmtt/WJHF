import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonInput, IonLabel, IonRow, IonText, IonTitle, IonToast } from "@ionic/react";
import { useRef, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");

    const [showToast, setShowToast] = useState(false);
    const [toastMess, setToastMess] = useState("");
    const history = useHistory();

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/register.php";
    const emailRef = useRef<HTMLIonInputElement>();
    const unameRef = useRef<HTMLIonInputElement>();
    const passRef = useRef<HTMLIonInputElement>();

    //regex to check valid email
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //regex to check valid password: at least 8 characters and includes letters and numbers
    const passwordCheck = /^(?=.*[a-zA-z])(?=.*\d).{8,}$/;

    const registerProcess = () => {
        //Log the values
        console.log("Input:", {
            email,
            username,
            pass1,
            pass2
        });

        //display toast error
        if(!email || !username || !pass1 || !pass2) {
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
        formdata.append("username", username);
        formdata.append("password", pass1);

        axios.post(url, formdata)
            .then((res) => {
                console.log("Response:", res.data);
                if(res.data.success) {
                    setToastMess("Registration successful");
                    setShowToast(true);
                    setTimeout(() => history.push("/login"), 3000);
                } else {
                    setToastMess("Registration failed");
                    setShowToast(true);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
                setToastMess("Error during registration");
                setShowToast(true);
            });
    };
    return(
        <IonContent>
            <div className="flex-container">
            <IonGrid class="auth-grid">
                <IonCol class="auth-col">
                    <IonRow class="center-stuff">
                        <IonTitle class="auth-title">Register</IonTitle>
                    </IonRow>
                    <IonRow>
                            <IonLabel class="auth-label">Email:</IonLabel>
                            <IonInput
                                class="auth-input"
                                color={"secondary"}
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                                placeholder="Email"></IonInput>
                        </IonRow>
                        <IonRow>
                            <IonLabel class="auth-label">Username:</IonLabel>
                            <IonInput
                                class="auth-input"
                                color={"secondary"}
                                value={username}
                                onIonChange={(e) => setUsername(e.detail.value!)}
                                placeholder="Username"></IonInput>
                        </IonRow>
                        <IonRow>
                            <IonLabel class="auth-label">Password:</IonLabel>
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
                            <IonLabel class="auth-label">Re-enter Password:</IonLabel>
                            <IonInput
                                class="auth-input"
                                color={"secondary"}
                                type="password"
                                value={pass2}
                                onIonChange={(e) => setPass2(e.detail.value!)}
                                placeholder="Password"></IonInput>
                        </IonRow>
                        <IonRow class="center-stuff">
                            <IonButton onClick={registerProcess} color={"secondary"}>Register</IonButton>
                        </IonRow>
                        <IonText class="center-stuff reg-text">
                            Already have an account? <Link to="/login" className="auth-link">Login</Link>
                        </IonText>
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
    );
};

export default Register;