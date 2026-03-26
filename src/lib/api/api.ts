// lib/api.ts

import { clientApiFetch } from "./client-api-client";
import { serverApiFetch } from "./server-api-clent";

export const api = {
    client: clientApiFetch,
    server: serverApiFetch,
};