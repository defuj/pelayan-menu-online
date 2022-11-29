import CartModel from "./CartModel";

export default interface TransactionModel{
    code: string;
    status: boolean;
    accepted: boolean;
    chair: string;
    name: string;
}