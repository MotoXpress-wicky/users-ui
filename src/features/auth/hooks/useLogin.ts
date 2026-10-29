import {useState} from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import { authApi } from '../api/authApi'
import {useAuthStore} from  '../stores/authStore'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { LoginCredentials } from '../types/auth.types'

export const useLogin = ()=>{
    const setUser = useAuthStore((state)=> state.setUser);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState<string|null>(null);
    
    const login = async(credentials:LoginCredentials) => {
        setIsLoading(true);
        setError(null);

        try{
        const user = await authApi.login(credentials);
        setUser(user);
        const from = (location.state as {from?:string}| null)?.from ?? '/';
        navigate(from,{replace:true});

        }catch(error:unknown){
          setError(getErrorMessage(error))
        }finally{
            setIsLoading(false);
        }
        
    }

    return {isLoading,error,login};
}