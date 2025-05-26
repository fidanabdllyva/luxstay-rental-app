export const toAbsoluteURL = (url: string): string =>
  url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin}${
        url.startsWith("/") ? "" : "/"
      }${url}`;