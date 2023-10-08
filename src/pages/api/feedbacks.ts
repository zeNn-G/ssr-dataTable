import type { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "@/lib/elastic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;

  const { searchText, statuses, pageIndex, pageSize } = body;

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
          from: pageIndex,
          size: pageSize,
        });

        const count = response.body.hits.total.value;

        const pageCount = Math.ceil(count / pageSize);

        res.status(200).json({
          message: "success",
          feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
          pageCount,
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
          from: pageIndex,
          size: pageSize,
        });

        const count = response.body.hits.total.value;

        const pageCount = Math.ceil(count / pageSize);

        res.status(200).json({
          message: "success",
          feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
          pageCount,
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
        from: pageIndex,
        size: pageSize,
      });

      const count = response.body.hits.total.value;

      const pageCount = Math.ceil(count / pageSize);

      res.status(200).json({
        message: "success",
        feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
        pageCount,
      });
    }

    const response = await elasticClient.search({
      index: "search_test",
      body: {
        query: {
          match_all: {},
        },
      },
      from: pageIndex,
      size: pageSize,
    });

    const count = response.body.hits.total.value;

    const pageCount = Math.ceil(count / pageSize);

    res.status(200).json({
      message: "success",
      feedbacks: response.body.hits.hits.map((hit: any) => hit._source),
      pageCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
