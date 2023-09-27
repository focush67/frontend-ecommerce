import Header from "@/components/Header";
import {useSession} from "next-auth/react";
export default function Payment(){
    const {data: session} = useSession();
    return(
        <>
        <Header profile={session?.user}/>
        <div>Payments</div>
        </>
    )
}