import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/services/blog.service";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/blog/[slug]
 * Public blog post by slug
 *
 * Query params:
 * - lang: string (optional, default: "en")
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    const post = await blogService.getBySlug(slug, lang);

    if (!post) {
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/not-found",
          title: "Not Found",
          status: 404,
          detail: "Blog post not found",
          instance: req.url,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error: any) {
    console.error("❌ [PUBLIC BLOG] GET BY SLUG Error:", error);
    return NextResponse.json(
      {
        type: error.type || "https://api.shop.am/problems/internal-error",
        title: error.title || "Internal Server Error",
        status: error.status || 500,
        detail: error.detail || error.message || "An error occurred",
        instance: req.url,
      },
      { status: error.status || 500 }
    );
  }
}

