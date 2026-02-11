export interface SzJstar {
  Id: number;
  TitleText: string | null;
  Hrefs: string | null;
  PublishTime: string | null;
  IstTuiSong: number | null;
  UserOpenid: string | null;
  InsertTime: string | null;
}

export interface ZbArticle {
  id: number;
  isSend: number | null;
  zbState: string | null;
  articleTime: string | null;
  fromWebSite: string | null;
  srckeyword: string | null;
  title: string | null;
  contentStr: string | null;
  keyStr: string | null;
  fromUrl: string | null;
  prcFlag: number | null;
  insertTime: string | null;
  address: string | null;
  detailUrl: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  total: number;
}
