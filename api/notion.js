import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        // Create a page in a Notion database
        await notion.pages.create({
          parent: { database_id: body.dbId },
          properties: body.properties,
        });
        res.status(200).json({ status: "Created" });
      } catch (error) {
        res.status(500).json({ error: "Failed to create page", details: error.message });
      }
      break;

    case "GET":
      try {
        // Query a Notion database
        const data = await notion.databases.query({ database_id: body.dbId });
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: "Failed to query database", details: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}