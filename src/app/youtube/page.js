"use client";

import { useState, useEffect } from "react";
import useGoogleSheet from "@/hooks/useGooglesheet";
import { GOOGLE_SHEET_ID, GID_LIST } from "@/constants/google-sheet";
import { formatRelativeTime } from "@/utils/dateToString";
import { extractVideoId } from "@/utils/youtubeConverter";
import { YouTubeCard, YouTubeCardSkeleton } from "@/widgets";

export default function YoutubeList() {
  const [rowData, setRowData] = useState([]);
  const { googleSheetRows, isLoading, error } = useGoogleSheet(
    GOOGLE_SHEET_ID,
    GID_LIST.YOUTUBE
  );

  useEffect(() => {
    if (googleSheetRows) {
      const formattedVideos = googleSheetRows.map((row) => {
        return {
          id: row[0],
          title: row[1],
          creator: row[2],
          url: row[3],
          videoId: extractVideoId(row[3]),
          uploadDate: formatRelativeTime(row[4]),
        };
      });
      setRowData(formattedVideos);
    }
  }, [googleSheetRows]);

  return (
    <div className="sub-page">
      <h1 className="sub-page__title">YouTube Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading || error
          ? [...Array(6)].map((_, index) => <YouTubeCardSkeleton key={index} />)
          : rowData.map((item) => {
              return <YouTubeCard key={item.id} item={item} />;
            })}
      </div>
    </div>
  );
}
