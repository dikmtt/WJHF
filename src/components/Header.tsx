import { IonAlert, IonAvatar, IonButton, IonButtons, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { AuthContext, useAuth } from "./context/AuthContext";
import { chevronBack } from "ionicons/icons";

const Header: React.FC = () => {
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [showPopover, setShowPopover] = useState(false);
    const [popoverEvent, setPopoverEvent] = useState<Event>();
    const [showLogoutConf, setShowLogoutConf] = useState(false);
    const authCtx = useContext(AuthContext);
    const { logout } = useAuth();
    const history = useHistory();
    const loc = useLocation();

    const handlePopover = (event: React.MouseEvent) => {
        event.persist();
        setPopoverEvent(event.nativeEvent);
        setShowPopover(true);
    }

    const toHome = () => {
        history.push("/home");
        //history.goBack();
    }

    const goBack = () => {
        history.goBack();
    }

    const logoutProcess = () => {
        setShowLogoutConf(true);
    }

    const goToProfile = () => {
        history.push("/profile");
    }
    return(
        <IonHeader>
            <IonToolbar color={"primary"}>
                {loc.pathname !== "/home" &&
                <IonButtons slot="start">
                    <IonButton onClick={goBack}>
                        <IonIcon icon={chevronBack} />
                    </IonButton>
                </IonButtons>}
                <IonTitle>WJHF</IonTitle>
                <IonButtons slot="end" onClick={handlePopover}>
                    <IonAvatar>
                        <img 
                            src={`/backend/${authCtx?.user.profile_pic}`}
                            alt="Profile Pic"
                            className="w-12 h-12 mt-2"
                        />
                    </IonAvatar>
                </IonButtons>
            </IonToolbar>
            <IonPopover
                event={popoverEvent}
                isOpen={showPopover}
                onDidDismiss={() => setShowPopover(false)}
            >
                <IonList>
                    <IonItem button onClick={goToProfile}>
                        <IonLabel>Profile</IonLabel>
                    </IonItem>
                    <IonItem button onClick={logoutProcess}>
                        <IonLabel>Logout</IonLabel>
                    </IonItem>
                </IonList>
            </IonPopover>

            <IonAlert
                isOpen={showLogoutConf}
                onDidDismiss={() => setShowLogoutConf(false)}
                header={"Logout"}
                message={"Are you sure?"}
                buttons={[
                    {
                        text: "No",
                        role: "cancel",
                        handler: () => {
                            setShowLogoutConf(false);
                        },
                    },
                    {
                        text: "Yes",
                        handler: () => {
                            logout();
                            history.push("/login");
                        },
                    },
                ]}
            />
        </IonHeader>
    );
}

export default Header;