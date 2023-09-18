import mongoose from 'mongoose';

export function mongooseConnect(){
    if(mongoose.connection.readyState === 1){
        return mongoose.connection.asPromise();
    }
    else{
        const uri= process.env.MONGO_URI;
        if(!uri){
            throw new Error("MongoDB URL not found");
        }
        return mongoose.connect(uri);
    }
}