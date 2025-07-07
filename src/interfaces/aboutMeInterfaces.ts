interface AboutMeQueryResult {
  about_me_group_id: number;
  slug: string;
  about_me_entry_id: number;
  part: number;
  entry_title: string;
  entry_text: string;
  entry_images: Array<{
    image_id: number;
    image_url: string;
    alt_text: string;
    sort_order: number;
  }>;
}

interface FormattedAboutMe {
  title: string;
  slug: string;
  paragraphs: Array<{
    part: number;
    title: string;
    text: string;
    images?: Array<{
      image_url: string;
      alt_text: string;
    }>;
  }>;
  all_about_me_images: string[];
}

export { AboutMeQueryResult, FormattedAboutMe };
