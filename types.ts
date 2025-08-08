@@ .. @@
 export interface AppSettings {
   theme: 'light' | 'dark';
   notifications: boolean;
   autoBackup: boolean;
   whatsapp: {
     connected: boolean;
     phoneNumber: string;
   };
+  mercadoPago: {
+    enabled: boolean;
+    accessToken: string;
+    publicKey: string;
+  };
 }