import {PaymentElement} from '@stripe/react-stripe-js';

export default function Checkout(){
    return(
        <form>
            <PaymentElement/>
            <button>Submit</button>
        </form>
    );
};