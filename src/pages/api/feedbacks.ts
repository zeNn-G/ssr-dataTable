import type { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "@/lib/elastic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;

  const { searchText, statuses } = body;

  try {
    if (searchText) {
      if (!statuses) {
        const response = await elasticClient.search({
          index: "search_test",
          body: {
            query: {
              bool: {
                must: {
                  bool: {
                    should: [
                      {
                        regexp: {
                          username: `.*${searchText}*`,
                        },
                      },
                      {
                        regexp: {
                          feedbackText: `.*${searchText}.*`,
                        },
                      },
                      {
                        regexp: {
                          statusName: `.*${searchText}.*`,
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        });

        res.status(200).json({
          message: "success",
          feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
        });
      } else {
        const response = await elasticClient.search({
          index: "search_test",
          body: {
            query: {
              bool: {
                must: [
                  {
                    terms: {
                      statusName: statuses,
                    },
                  },
                  {
                    bool: {
                      should: [
                        {
                          regexp: {
                            username: `.*${searchText}*`,
                          },
                        },
                        {
                          regexp: {
                            feedbackText: `.*${searchText}.*`,
                          },
                        },
                        {
                          regexp: {
                            statusName: `.*${searchText}.*`,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        });

        res.status(200).json({
          message: "success",
          feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
        });
      }
    }

    if (statuses) {
      const response = await elasticClient.search({
        index: "search_test",
        body: {
          query: {
            bool: {
              must: [
                {
                  terms: {
                    statusName: statuses,
                  },
                },
              ],
            },
          },
        },
      });

      res.status(200).json({
        message: "success",
        feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
      });
    }

    const response = await elasticClient.search({
      index: "search_test",
      body: {
        query: {
          match_all: {},
        },
      },
    });

    res.status(200).json({
      message: "success",
      feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
      pageCount: 1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
