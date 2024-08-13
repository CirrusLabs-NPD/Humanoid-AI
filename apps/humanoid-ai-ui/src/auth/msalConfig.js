import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: '49d89fbb-afad-49f8-97bb-7ff26d0051d3',
        authority: 'https://login.microsoftonline.com/a858d9da-8dfa-4b12-9f90-d0448a34f6d1',
        // redirectUri: 'https://resumeminner.azurewebsites.net/home',
        redirectUri: 'http://localhost:3000/',
        postLogoutRedirectUri: "/",
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    // system: {	
    //     loggerOptions: {	
    //         loggerCallback: (level, message, containsPii) => {	
    //             if (containsPii) {		
    //                 return;		
    //             }		
    //             switch (level) {
    //                 case LogLevel.Error:
    //                     console.error(message);
    //                     return;
    //                 case LogLevel.Info:
    //                     console.info(message);
    //                     return;
    //                 case LogLevel.Verbose:
    //                     console.debug(message);
    //                     return;
    //                 case LogLevel.Warning:
    //                     console.warn(message);
    //                     return;
    //                 default:
    //                     return;
    //             }	
    //         }	
    //     }	
    // }
}