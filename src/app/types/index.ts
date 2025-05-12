export type Article = {
  title: string;
  author: string;
  publishedAt: string;
  type: "news" | "blog";
};

export type PayoutRate = {
  news: number;
  blog: number;
};

export type AuthorPayout = {
  author: string;
  newsCount: number;
  blogCount: number;
  total: number;
};
