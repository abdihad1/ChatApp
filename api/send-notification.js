import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const {
            token,
            title,
            body
        } = req.body;

        const response = await getMessaging().send({
            token,
            notification: {
                title,
                body
            }
        });

        res.status(200).json({
            success: true,
            id: response
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

}