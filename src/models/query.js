import { pool } from "../config/databaseBsale.js";

const data = (query, values) =>
  pool
    .query(query, values)
    .then(([rows]) => rows)
    .catch(({ code, message }) => {
      const error = { status: false, code, message }; 
      throw error;
    });

export default data;