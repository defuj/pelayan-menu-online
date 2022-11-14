export default interface CartModel{
    id: number;
    nama: string;
    harga: string;
    deskripsi: string;
    cover: Array<string>;
    badge: string;
    qty: number;
    note: string;
}