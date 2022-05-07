import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getMessaging} from "firebase-admin/messaging";
initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const sendEditListNoti = functions.https.onCall((data, context) => {
  const listName = data.listName;
  const subscribedUsers = data.subscribedUsers;
  const usersName = context.auth?.token.name || null;
  const picture = data.picture;

  subscribedUsers.map((uid: string) => {
    if (uid != context.auth?.uid) {
      const payload = {
        notification: {
          title: "Edited List",
          body: `${usersName} edited "${listName}"`,
          image: picture,
        }, apns: {
          payload: {
            aps: {
              "mutable-content": 1,
            },
          }, fcm_options: {
            image: picture,
          },
        }, data: {
          listName,
          usersName,
          picture,
          action: "EditList",
        },
        topic: `Users.${uid}`,
      };

      functions.logger.info("sendEditListNoti logs!", payload);

      getMessaging().send(payload).then((response) => {
        console.log("Successfully sent message:", response);
      }).catch((error) => {
        console.log("Error sending message:", error);
      });
    }
  });
});
