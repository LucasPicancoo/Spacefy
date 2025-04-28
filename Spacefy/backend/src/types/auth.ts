export interface AuthenticationData {
  id: string;
  role: "locatario" | "usuario" | "admin"; // Papel do usuário: locatário, usuário comum ou admin
}
