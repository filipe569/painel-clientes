@@ .. @@
 interface ClientListProps {
   clients: Client[];
   onEdit: (client: Client) => void;
   onDelete: (id: string) => void;
+  mercadoPagoEnabled?: boolean;
 }
 
-export default function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
+export default function ClientList({ clients, onEdit, onDelete, mercadoPagoEnabled }: ClientListProps) {
   return (
@@ .. @@
         {clients.map((client) => (
           <ClientRow
             key={client.id}
             client={client}
             onEdit={onEdit}
             onDelete={onDelete}
+            mercadoPagoEnabled={mercadoPagoEnabled}
           />
         ))}