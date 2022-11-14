import axios from 'axios';

export default axios.create({
  baseURL: `https://dashboard.daftarmenu.com/api/v1/`,
  headers: {
    'X-AUTH': `sdgt-smd2022`
  }
});

export const products = 'produk';
export const restaurant = 'resto';