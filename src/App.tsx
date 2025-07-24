import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/MainPages/Home/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import { AuthContext, AuthProvider, useAuth } from './components/context/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import HotelList from './pages/MainPages/HotelList/HotelList';
import NewHotel from './pages/MainPages/HotelList/NewHotel';
import HotelDetails from './pages/MainPages/HotelList/HotelDetails';
import EditHotel from './pages/MainPages/HotelList/EditHotel';
import DestinationsList from './pages/MainPages/DestinationsList/DestinationsList';
import AddDest from './pages/MainPages/DestinationsList/AddDest';
import CriteriaPriorities from './pages/MainPages/GetRecommendation/CriteriaPriorities';
import CriteriaPreference from './pages/MainPages/GetRecommendation/CriteriaPreference';
import FinalRec from './pages/MainPages/GetRecommendation/FinalRec';
import History from './pages/MainPages/History/History';
import Profile from './pages/MainPages/Profile/Profile';
import PassReset from './pages/Auth/PassReset/PassReset';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AuthProvider>
        <RouteList />
      </AuthProvider>
    </IonReactRouter>
  </IonApp>
);

const RouteList: React.FC = () => {
  const {isAuthenticated, login} = useAuth();
  const loc = useLocation();
  //console.log(loc.pathname);
  /*useEffect(() => {
    const dontdorefreshontheseroutes = ["/login", "/register"];
    if(dontdorefreshontheseroutes.includes(loc.pathname)) {
      return;
    }
    //if(loc.pathname !== "/login") {
      window.addEventListener("beforeunload", () => {
        localStorage.setItem("currRoute", loc.pathname);
      });
      return () => {
        window.removeEventListener("beforeunload", () => {
          localStorage.setItem("currRoute", loc.pathname);
        });
      }
    //}
  }, [loc.pathname]);*/
  return(
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/passreset" component={PassReset} />
      {isAuthenticated ? (
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home" component={Home} />
            <Route exact path="/hotels" component={HotelList} />
            <Route exact path="/newhotel" component={NewHotel} />
            <Route path="/hoteldetails/:hotelId" component={HotelDetails} />
            <Route path="/edithotel/:hotelId" component={EditHotel} />
            <Route exact path="/destinations" component={DestinationsList} />
            <Route exact path="/newdest" component={AddDest} />
            <Route exact path="/rec/priorities" component={CriteriaPriorities} />
            <Route exact path="/rec/preference" component={CriteriaPreference} />
            <Route exact path="/rec/result" component={FinalRec} />
            <Route exact path="/history" component={History} />
            <Route exact path="/profile" component={Profile} />
          </IonRouterOutlet>
        </IonTabs>
      ) : (
        <Redirect to="/login" />
      )}
    </Switch>
  );
}

export default App;
