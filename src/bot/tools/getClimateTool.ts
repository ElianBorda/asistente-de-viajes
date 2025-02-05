import { tool } from "@langchain/core/tools";

import { z } from "zod";
import { getClimate } from "../../service/Api.js";

export const getClimateTool = tool(
    async ({ lat, lon, date }: { lat: number; lon: number; date?: string }) => {
      return await getClimate(lat, lon);
    },
    {
      name: "getClimate",
      description: "Obtains climatic information from geographic coordinates.",
      schema: z.object({
        lat: z.number().describe("Latitude decimal"),
        lon: z.number().describe("Longitude decimal")
      })
    }
  );