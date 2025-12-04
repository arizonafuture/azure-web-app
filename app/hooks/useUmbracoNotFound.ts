// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ApiResponse } from "../types";
// import { API_BASE_URL } from "../config/umbraco";

// export const useUmbracoNotFound = () => {
//   const [data, setData] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load404 = async () => {
//       try {
//         const res = await axios.get<ApiResponse>(
//           `${API_BASE_URL}/umbraco/delivery/api/v2/content/item/not-found/`
//         );
//         console.log(res.data)
//         setData(res.data);
//       } catch (e) {
//         console.error("Failed to load 404 page content", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load404();
//   }, []);

//   return { data, loading };
// };
