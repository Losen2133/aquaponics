export const getStatus = (value: number | undefined, min: number, max: number) => {
    if (value === undefined) return "normal"
    if (value < min || value > max) return "critical"
    if (value < min * 1.1 || value > max * 0.9) return "warning"
    return "normal"
  }