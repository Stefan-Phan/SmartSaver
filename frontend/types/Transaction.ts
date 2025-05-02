export interface Transaction {
  ID: number;
  UserID?: number;
  CategoryID: number;
  Name: string;
  Amount: string;
  Type: "income" | "expense";
  CreatedAt?: string;
  CategoryName?: string;
}
