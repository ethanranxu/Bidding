"use server";

import { getPool } from "@/lib/db";
import type { ZbArticle, PaginatedResult } from "@/types";

const PAGE_SIZE = 30;

export async function fetchZbArticle(
    page: number,
    query?: string,
    filterDays?: number,
    tags?: string[]
): Promise<PaginatedResult<ZbArticle>> {
    const pool = await getPool();
    const offset = (page - 1) * PAGE_SIZE;

    let whereClauses: string[] = [];
    const request = pool.request();

    if (query) {
        whereClauses.push("title LIKE @query");
        request.input("query", `%${query}%`);
    }

    if (filterDays) {
        whereClauses.push("DATEDIFF(day, articleTime, GETDATE()) <= @filterDays");
        request.input("filterDays", filterDays);
    }

    if (tags && tags.length > 0) {
        const tagConditions = tags.map((_, index) => `title LIKE @tag${index}`);
        whereClauses.push(`(${tagConditions.join(" OR ")})`);
        tags.forEach((tag, index) => {
            request.input(`tag${index}`, `%${tag}%`);
        });
    }

    const whereSql = whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";

    const countSql = "SELECT COUNT(*) AS total FROM dbo.zb_article" + whereSql;

    // 按发布时间倒序
    const dataSql = `SELECT id, zbState, articleTime, fromWebSite, srckeyword, title,
              keyStr, fromUrl, insertTime, address, detailUrl
       FROM dbo.zb_article
       ${whereSql}
       ORDER BY articleTime DESC
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`;

    const countResult = await request.query(countSql);
    const total: number = countResult.recordset[0].total;

    const result = await request
        .input("offset", offset)
        .input("pageSize", PAGE_SIZE)
        .query(dataSql);

    return {
        data: result.recordset as ZbArticle[],
        hasMore: offset + PAGE_SIZE < total,
        total,
    };
}
