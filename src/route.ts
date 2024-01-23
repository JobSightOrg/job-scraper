import { FastifyInstance } from "fastify";
import MicrosoftBrowser from "./modules/microsoft_task/microsoft-browser";

interface RequestBody {
  user: string;
  url: string;
}

interface RequestParam {
  website: string;
}

const responseSchema = {
  response: {
    200: {
      properties: {
        result: { type: "boolean" },
      },
    },
  },
};

export async function defaultRoutes(server: FastifyInstance) {
  server.get("/healthcheck", async function () {
    return { status: "OK" };
  });
}

export async function apiRoutes(server: FastifyInstance) {
  let counter = 0;
  server.post(
    "/webtask/:website",
    { schema: responseSchema },
    async function (req, res) {
      const { url } = req.body as RequestBody;
      const { website } = req.params as RequestParam;
      let result: boolean = false;

      switch (website) {
        case "microsoft":
          const microsoftBrowserInstance = await MicrosoftBrowser.getInstance();

          counter++;
          result = await microsoftBrowserInstance.execTask(url, counter);
          break;
        case "google":
          break;
      }

      const status = result ? 200 : 500;
      res.status(status).send({ result });
    }
  );
}
