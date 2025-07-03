import type { LightLevelResponse } from "@/interfaces/interfaces";

const API_URL = 'http://192.168.93.240/ldr';

const getLightLevel = async (): Promise<LightLevelResponse> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch light level');
  return response.json();
};

const LightService = {
  getLightLevel,
};

export default LightService;
