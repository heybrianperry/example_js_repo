import { setupServer } from "msw/node";
import requestHandlers from "./handlers";

const handlers = [...requestHandlers];

export default setupServer(...handlers);
