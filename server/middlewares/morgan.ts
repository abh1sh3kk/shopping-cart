import morgan from "morgan";

export const morganMiddleware = morgan(
  ":date[iso] :method :url :status :res[content-length] bytes - :response-time ms - :user-agent",
  {
    stream: {
      write: (message) => console.log(message.trim()),
    },
  }
);
