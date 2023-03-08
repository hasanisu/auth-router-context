import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import {createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth'
import app from '../firebase/firebase.config';
import { useEffect } from 'react';


export const AuthContext = createContext();

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const UserContext = ({children}) => {
    const [user, setUser] = useState({});
// page loading er time eita load hobe and jokhon state ta peye jabe tokhn eita stop hoye jabe
    const [loading, setLoading] = useState(true);

    // For Registration
    const createUser = (email, password)=>{
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // For Sign In
    const  signIn = (email, password)=>{
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Sign out
    const logOut=()=>{
        return signOut(auth);
    }

    const signInWithGoogle=()=>{
        return signInWithPopup(auth, googleProvider);
    }

    // Why are we doing this?
    // user ta kon jaigai change hobe amra jani na eijonno useEffect eita ke central jaigai dhore rakhe 
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, currentUser=>{
            setUser(currentUser);
            setLoading(false);
            console.log('chaged current user', currentUser)
        })
        return()=>{
            unsubscribe();
        }
    },[])

    const authInfo ={user, loading, createUser, signIn, logOut, signInWithGoogle};

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default UserContext;