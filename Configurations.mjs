import * as admin from 'firebase-admin';
import serviceAccount from './privateKey.json';
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    storageBucket:"https://console.firebase.google.com/project/frontend-43f86/storage/frontend-43f86.appspot.com/files",
});

const sourceBucket = admin.storage().bucket();
const destinationBucket = admin.storage().bucket("https://console.firebase.google.com/project/frontend-2-e7ae3/storage/frontend-2-e7ae3.appspot.com/files");

async function copyImages(){
    try {
        const [files] = await sourceBucket.getFiles();
        for(const file of files){
            const destinationFile = destinationBucket.file(file.name);
            await file.copy(destinationFile);
            console.log(`Copied ${file.name} to Destination Bucekt`);
        }

        console.log("Image transfer completed");
    } catch (error) {
        console.log("Error occured");
    }
}

copyImages();