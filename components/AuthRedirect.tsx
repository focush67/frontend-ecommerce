import { useEffect } from "react";
import { useRouter } from "next/router";
import {useSession,signIn} from "next-auth/react";

export default function AuthRedirect(){
    const {data : session} = useSession();
    const router = useRouter();

    useEffect(()=>{
        const handleClick = async(event:any) => {
            if((event.target.tagName === "BUTTON" || event.target.tagName === "A") && !session)
            {
                event.preventDefault();
                await signIn("google");
            }
        };

        document.addEventListener("click" , handleClick);

        return () => {
            document.removeEventListener("click",handleClick);
        }
    },[session,router]);

    return null;
}