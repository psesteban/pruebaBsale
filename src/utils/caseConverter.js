export function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  
  export function convertToCamelCase(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => convertToCamelCase(item));
    } else if (obj !== null && typeof obj === 'object') {
      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        const camelKey = toCamelCase(key);
        converted[camelKey] = convertToCamelCase(value);
      }
      return converted;
    }
    return obj;
  }