import bunyan from "bunyan";
import PrettyStream from "bunyan-prettystream";

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const logger = bunyan.createLogger({
  name: "koa-skeleton",
  streams: [
    {
      level: "debug",
      type: "raw",
      stream: prettyStdOut,
    },
  ],
});

export const koaLogger = (url: string): void => {
    if (!url.includes("health")) {
      logger.info(url)
    }
}

export default logger;
