import Mysql from "serverless-mysql";
export const pool = Mysql({
  config: { host: 'localhost',
            user: 'root',
            password: '',
            database: 'contratnetunodb' }
})
