export function isYouTubeUrl(url?: string | null) {
  if (!url) return false;

  return (
    url.includes("youtube.com/watch") ||
    url.includes("youtube.com/embed") ||
    url.includes("youtu.be/")
  );
}

export function getYouTubeEmbedUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }

      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

export function isDirectVideoUrl(url?: string | null) {
  if (!url) return false;

  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}
