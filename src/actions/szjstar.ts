"use server";

import { getPool } from "@/lib/db";
import type { SzJstar, PaginatedResult } from "@/types";

const PAGE_SIZE = 30;

export async function fetchSzJstar(
    page: number,
    query?: string,
    filterDays?: number,
    tags?: string[]
): Promise<PaginatedResult<SzJstar>> {
    const pool = await getPool();
    const offset = (page - 1) * PAGE_SIZE;

    let whereClauses: string[] = [];
    const request = pool.request();

    if (query) {
        whereClauses.push("TitleText LIKE @query");
        request.input("query", `%${query}%`);
    }

    if (filterDays) {
        whereClauses.push("DATEDIFF(day, PublishTime, GETDATE()) <= @filterDays");
        request.input("filterDays", filterDays);
    }

    if (tags && tags.length > 0) {
        const tagConditions = tags.map((_, index) => `TitleText LIKE @tag${index}`);
        whereClauses.push(`(${tagConditions.join(" OR ")})`);
        tags.forEach((tag, index) => {
            request.input(`tag${index}`, `%${tag}%`);
        });
    }

    const whereSql = whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";

    const countSql = "SELECT COUNT(*) AS total FROM dbo.SzJstar" + whereSql;

    // 按发布时间倒序
    const dataSql = `SELECT Id, TitleText, Hrefs, PublishTime, IstTuiSong, InsertTime
       FROM dbo.SzJstar
       ${whereSql}
       ORDER BY PublishTime DESC
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`;

    const countResult = await request.query(countSql);
    const total: number = countResult.recordset[0].total;

    const result = await request
        .input("offset", offset)
        .input("pageSize", PAGE_SIZE)
        .query(dataSql);

    return {
        data: result.recordset as SzJstar[],
        hasMore: offset + PAGE_SIZE < total,
        total,
    };
}
