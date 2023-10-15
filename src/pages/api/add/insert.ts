import type { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "@/lib/elastic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;

  const { username, feedbackText, statusName, categoryName } = body;

  try {
    await elasticClient.index({
      index: "search_test",
      body: {
        user: {
          username,
        },
        feedbackText,
        statusName,
        categoryName,
      },
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
