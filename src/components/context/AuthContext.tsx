import React, { createContext, ReactNode, useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    bio: string | null;
    profile_pic: string | null;
    is_admin: number;
    is_active: number;
    date_created: string | null;
}

export interface Hotel {
    id: number;
    name: string;
    address: string;
    class: string;
    price: string;
    hasWifi: string;
    hasResto: number;
    hasPool: number;
    desc: string | null;
    lat: number;
    lng: number;
    image: string | null;
    hist_date: string | null;
}

export interface Dest {
    id: number;
    name: string;
    type: string;
    lat: number;
    lng: number;
    image: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    uName: string;
    user: User;
    login: (uname: string, usr: User) => void;
    logout: () => void;
    updateUser: (
        username: string,
        bio: string,
        profilePic: string
    ) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used with AuthProvider");
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [uName, setUName] = useState("");
    const [user, setUser] = useState<User>({
        id: 0,
        email: "abc",
        username: "abc",
        password: "abc",
        bio: null,
        profile_pic: null,
        is_admin: 0,
        is_active: 0,
        date_created: null
    });
    const history = useHistory();
    const loc = useLocation();

    const login = (uname: string, usr: User) => {
        //console.log(loc.pathname);
        setIsAuthenticated(true);
        setUName(uname);
        setUser(usr);
        localStorage.setItem("userData", JSON.stringify(usr));
        //const route = localStorage.getItem("currRoute");
        /*if(route) {
            history.push(route);
        } else {*/
            history.push("/home");
        //}
    }

    const logout = () => {
        setIsAuthenticated(false);
        setUName("");
        setUser({
            id: 0,
            email: "abc",
            username: "abc",
            password: "abc",
            bio: null,
            profile_pic: null,
            is_admin: 0,
            is_active: 0,
            date_created: null
        });
        localStorage.removeItem("userData");
        //localStorage.removeItem("currRoute");
        history.push("/login");

    }

    const updateUser = (
        username: string,
        bio: string,
        profilePic: string
    ) => {
        user.username = username;
        user.bio = bio;
        user.profile_pic = profilePic;
    };

    return(
        <AuthContext.Provider
            value={{isAuthenticated, uName, user, login, logout, updateUser}}
        >
            {children}
        </AuthContext.Provider>
    );
};