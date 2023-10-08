import React from "react";
import { type GetServerSideProps } from "next";
import axios from "axios";

import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Feedback } from "@/types";

import {
  priorities as prioritiesMap,
  statuses as statusesMap,
} from "@/components/data-table/data/data";

type Props = {
  feedbacks: Feedback[];
  pageCount: number;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { searchText, statusName, page, per_page } = ctx.query;

  // Number of items per page
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10;

  const offset =
    typeof page === "string"
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0;

  const statuses =
    typeof statusName === "string"
      ? (statusName.split(".") as Feedback["statusName"][])
      : [];

  try {
    const { data } = await axios.post("http://localhost:3000/api/feedbacks", {
      searchText: searchText ?? null,
      statuses: statuses.length > 0 ? statuses : null,
      pageIndex: offset,
      pageSize: limit,
    });

    return {
      props: {
        feedbacks: data.feedbacks,
        pageCount: data.pageCount,
      },
    };
  } catch (error) {
    return {
      props: {
        feedbacks: {},
        pageCount: 0,
      },
    };
  }
};

const Home = ({ feedbacks, pageCount }: Props) => {
  return (
    <DataTable
      data={feedbacks}
      pageCount={pageCount}
      columns={columns}
      filterableColumns={[
        {
          id: "statusName",
          title: "Status",
          options: statusesMap.map((status) => ({
            label: status.label,
            value: status.value,
            icon: status.icon,
          })),
        },
      ]}
    />
  );
};

export default Home;
