// src/config/runtimeConfig.ts

export interface RuntimeConfig {
  apiBaseUrl: string;
}

let runtimeConfig: RuntimeConfig | null = null;

export const loadRuntimeConfig = async (): Promise<RuntimeConfig> => {
  if (runtimeConfig !== null) {
    return runtimeConfig;
  }

  try {
    const response = await fetch("/api/config", {
      cache: "no-store",
    });

    if (!response.ok) {
      // Fallback config when backend is not available
      runtimeConfig = { apiBaseUrl: "" };
      return runtimeConfig;
    }

    const data: RuntimeConfig = await response.json();
    runtimeConfig = data;
    return data;
  } catch {
    // Fallback when backend is unreachable
    runtimeConfig = { apiBaseUrl: "" };
    return runtimeConfig;
  }
};

export const getRuntimeConfig = (): RuntimeConfig => {
  if (runtimeConfig === null) {
    throw new Error(
      "Runtime config not loaded. Call loadRuntimeConfig() before using APIs."
    );
  }

  return runtimeConfig;
};
