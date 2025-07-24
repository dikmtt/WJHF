import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonInput, IonLabel, IonRow, IonText, IonTitle, IonToast } from "@ionic/react";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import axios, { AxiosResponse } from "axios";
import { useAuth, User } from "../../../components/context/AuthContext";

const Login: React.FC = () => {
    const {login} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showToast, setShowToast] = useState(false);
    const [toastMess, setToastMess] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<AxiosResponse>();
    const [user, setUser] = useState<User | null>(null);
    const history = useHistory();
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const url = "/backend/login.php";
    const loginProcess = () => {
        console.log("Login attempted with: ", email, password);
        const formdata = new FormData();
        formdata.append("email", email);
        formdata.append("password", password);
        axios.post(url, formdata)
        .then((res) => {
            if(res.data.success) {
                setLoading(true);
                login(res.data.user[0].username, res.data.user[0]);
                //2 second delay for login
                setTimeout(() => {
                    setLoading(false);
                    history.push("/home");
                }, 2000);
                //console.log(res.data);
            } else {
                setToastMess("Incorrect credentials");
                setShowToast(true);
            }
        })
        .catch(() => {
            setToastMess("Error");
            setShowToast(true);
        })
    }

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if(userData) {
            const usr = JSON.parse(userData);
            setUser(usr);
            login(usr.username, usr);
        }
    }, [login]);

    return(
        <IonContent className="center-stuff-2">
            <div className="flex-container">
                <IonGrid class="auth-grid">
                    <IonCol class="auth-col">
                        <IonRow class="center-stuff">
                            <IonTitle class="auth-title">Welcome to WJHF</IonTitle>
                            <IonTitle class="auth-subtitle">(West Jakarta Hotel Finder)</IonTitle>
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
                            <IonLabel class="auth-label">Password:</IonLabel>
                            <IonInput
                                class="auth-input"
                                color={"secondary"}
                                type="password"
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value!)}
                                placeholder="Password"></IonInput>
                        </IonRow>
                        <IonRow class="center-stuff">
                            <IonButton 
                                onClick={loginProcess}
                                color={"secondary"}
                            >Login</IonButton>
                        </IonRow>
                        <IonText class="center-stuff reg-text">
                            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
                        </IonText>
                        <IonText class="center-stuff reg-text">
                            <Link to="/passreset" className="auth-link">Forgot password?</Link>
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

export default Login;