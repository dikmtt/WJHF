import { IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../../components/ExploreContainer';
import './Home.css';
import { AuthContext, useAuth } from '../../../components/context/AuthContext';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import Header from '../../../components/Header';
import { airplaneOutline, businessOutline, reload, reloadOutline, searchOutline } from 'ionicons/icons';

const Home: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const { logout } = useAuth();
  const history = useHistory();
  const goToHotels = () => {
    history.push("/hotels");
  }
  const goToDests = () => {
    history.push("/destinations");
  }
  const goToRec = () => {
    history.push("/rec/priorities");
  }
  const goToHist = () => {
    history.push("/history");
  }
  return (
    <IonPage>
      <Header />
        <div className="flex-container">
          <IonGrid class='auth-grid'>
            <IonCol>
              <IonRow class='menu-title'>
                <IonTitle class='menu-title-text'>West Jakarta Hotel Finder</IonTitle>
              </IonRow>
                <a href='/hotels' className="menu-item-text" onClick={(e) => {e.preventDefault();}}>
                  <div onClick={goToHotels} className="menu-item">
                      <IonCol size="2" className='menu-item-logo'>
                        <IonIcon icon={businessOutline} />
                      </IonCol>
                      <IonCol>
                        <IonLabel>List of Hotels</IonLabel>
                      </IonCol>
                  </div>
                </a>
                <a href='/destinations' className="menu-item-text" onClick={(e) => {e.preventDefault();}}>
                  <div onClick={goToDests} className="menu-item">
                      <IonCol size="2" className='menu-item-logo'>
                        <IonIcon icon={airplaneOutline} />
                      </IonCol>
                      <IonCol>
                        <IonLabel>List of Destinations</IonLabel>
                      </IonCol>
                  </div>
                </a>
                {authCtx?.user.is_admin == 0 && (
                  <a href='/rec/priorities' className="menu-item-text" onClick={(e) => {e.preventDefault();}}>
                  <div onClick={goToRec} className="menu-item">
                    <IonCol size="2" className='menu-item-logo'>
                      <IonIcon icon={searchOutline} />
                    </IonCol>
                    <IonCol>
                      <IonLabel>Recommend Me</IonLabel>
                    </IonCol>
                  </div>
                  </a>
                )}
                {authCtx?.user.is_admin == 1 && (
                  <a href='/history' className="menu-item-text" onClick={(e) => {e.preventDefault();}}>
                  <div onClick={goToHist} className="menu-item">
                    <IonCol size="2" className='menu-item-logo'>
                      <IonIcon icon={reloadOutline} />
                    </IonCol>
                    <IonCol>
                      <IonLabel>View History</IonLabel>
                    </IonCol>
                  </div>
                  </a>
                )}
            </IonCol>
          </IonGrid>
        </div>
    </IonPage>
  );
};

export default Home;
