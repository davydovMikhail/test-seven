import { useCallback } from "react";
import axios from 'axios';
const API = process.env.REACT_APP_BASE_API as string;
const eID = process.env.REACT_APP_E_ID as string;

export const useGet = () => {
    
    return useCallback(
      async () => {
        try {
            const request = await axios.get(`${API}v1/outlay-rows/entity/${eID}/row/list`)
            return request.data;
        } catch (error: any) {
            const errorMessage =
            error?.error?.message ||
            error?.message ||
            "Check console logs for error";
            console.error(error);
            console.error(errorMessage);
        }
      },
      []
    );
  };