import { signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, provider } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string
  }
  
  type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>
  }

export const AuthContext = createContext({} as AuthContextType)

type AuthContextProviderProps = {
    children: ReactNode
}

export function AuthContextProvider(props: AuthContextProviderProps){
    const [user, setUser] = useState<User>()

    useEffect(()=> {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user){
          const {displayName, photoURL, uid } = user
          
        if(!displayName || !photoURL){
          throw new Error ('Missing information from google account.')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
        }
      })
  
      return () => {
        unsubscribe();
      }
    }, [])
  
    async function signInWithGoogle(){
      
          
      const result = await signInWithPopup(auth, provider)
      
      if (result.user){
        const {displayName, photoURL, uid } = result.user
  
        if(!displayName || !photoURL){
          throw new Error ('Missing information from google account.')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
  
          
    }
    
    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}