import CartModel from "./CartModel";

export default interface TransactionModel{
    code: string;
    status: boolean;
    chair: string;
    name: string;
    menu: CartModel[];
}