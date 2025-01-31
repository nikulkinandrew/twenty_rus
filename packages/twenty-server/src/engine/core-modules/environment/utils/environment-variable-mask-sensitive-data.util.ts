import { EnvironmentVariablesMaskingStrategies } from 'src/engine/core-modules/environment/enums/environment-variables-masking-strategies.enum';

export const environmentVariableMaskSensitiveData = (
  value: string,
  strategy: EnvironmentVariablesMaskingStrategies,
  options?: { chars?: number },
): string => {
  if (!value) return value;

  switch (strategy) {
    case EnvironmentVariablesMaskingStrategies.LAST_N_CHARS: {
      const n = options?.chars ?? 5;

      return value.length > n ? `********${value.slice(-n)}` : '********';
    }

    case EnvironmentVariablesMaskingStrategies.HIDE_PASSWORD: {
      try {
        const url = new URL(value);

        if (url.password) {
          url.password = '********';
        }
        if (url.username) {
          url.username = '********';
        }

        return url.toString();
      } catch {
        return value;
      }
    }

    default:
      return value;
  }
};
