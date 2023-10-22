import React,{Component,ErrorInfo,ReactNode} from "react";

interface ErrorBoundaryProps{
    children: ReactNode;
}

interface ErrorBoundaryState{
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps,ErrorBoundaryState>{
    constructor(props: ErrorBoundaryProps){
        super(props);
        this.state = {hasError: false};
    }

    static getDerievedStateFromError(_: Error){
        return {hasError: true};
    }

    componentDidCatch(error: Error,errorInfo: ErrorInfo):void{
        console.error(error,errorInfo);
    }

    render(){
        if(this.state.hasError){
            return <h1>Something went wrong. Please Try Again Later</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;