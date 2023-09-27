import { useCallback } from "react";
import axios from 'axios';
const API = process.env.REACT_APP_BASE_API as string;
const eID = process.env.REACT_APP_E_ID as string;

export const useUpdate = () => {
    
    return useCallback(
      async (
        rID: number, 
        name: string, 
        salary: number, 
        equipment: number,
        overheads: number,
        estimatedProfit: number
      ) => {
        try {
            const request = await axios.post(`${API}v1/outlay-rows/entity/${eID}/row/${rID}/update`,
                {
                    equipmentCosts: equipment,
                    estimatedProfit: estimatedProfit,
                    machineOperatorSalary: 0,
                    mainCosts: 0,
                    materials: 0,
                    mimExploitation: 0,
                    overheads: overheads,
                    rowName: name,
                    salary: salary,
                    supportCosts: 0
                }
            )
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