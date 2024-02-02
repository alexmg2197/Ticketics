import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging'

const cone = {
    apiKey: "AIzaSyCyZRXxnmhuZyEdvk3z1pdVWb-dXGH8bcw",
    authDomain: "satic-a531b.firebaseapp.com",
    projectId: "satic-a531b",
    storageBucket: "satic-a531b.appspot.com",
    messagingSenderId: "867055708910",
    appId: "1:867055708910:web:770aac2581b5924e7521ff",
    measurementId: "G-C3V6GKHQ68"
};

const app = initializeApp(cone)

export const messaging = getMessaging(app)