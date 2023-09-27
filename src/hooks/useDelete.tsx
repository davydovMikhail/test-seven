import { useCallback } from "react";
import axios from 'axios';
const API = process.env.REACT_APP_BASE_API as string;
const eID = process.env.REACT_APP_E_ID as string;

export const useDelete = () => {
    
    return useCallback(
      async (rID: number) => {
        try {
            const request = await axios.delete(`${API}v1/outlay-rows/entity/${eID}/row/${rID}/delete`)
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