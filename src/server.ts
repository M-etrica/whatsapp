/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import http from 'http';
import dotenv from 'dotenv';
dotenv.config({ path: './src/variables.env' });
// import mongoose from 'mongoose';
import app from './app';

declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
global.__rootdir__ = process.cwd() || __dirname;

async function initSever() {
  // let connection: typeof mongoose | null = null;
  try {
    // connection = await mongoose
    //   .connect(String(process.env.DATABASE))
    //   .then((conn) => {
    //     console.log('Connected to database');
    //     return conn;
    //   });

    // mongoose.connection.on('error', (err) => `❌🤬❌🤬 ${err}`);

    const PORT = Number(process.env.PORT);
    const httpServer = http.createServer(app);

    await new Promise<void>((resolve) => {
      httpServer.listen({ port: PORT }, resolve);
    });
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  } catch (err) {
    // if (connection) {
    //   connection.connection.close();
    // }
    console.log(err);
    process.exit(1);
  }
}

initSever();
