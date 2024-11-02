"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = getData;
const axios_1 = __importDefault(require("axios"));
// export function getData({ url, headers, params }: GetDataParams): Promise<any> {
//   return axios
//     .get(url, { params, headers, timeout: 1000 })
//     .then((response) => {
//       response.data;
//     })
//     .catch((error) => {
//       console.error(error);
//       throw error;
//     });
// }
async function getData({ url, headers, params, }) {
    const response = await axios_1.default.get(url, { params, headers, timeout: 1000 });
    return response.data;
}
