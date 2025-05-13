import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  // Truncate content for preview
  const previewContent =
    post.content.length > 150
      ? `${post.content.substring(0, 150)}...`
      : post.content;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6">
        <CardTitle className="line-clamp-2 text-2xl">
          <Link href={`/blog/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="line-clamp-3 text-muted-foreground">{previewContent}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          By {post.author.name}
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(post.createdAt)}
        </div>
      </CardFooter>
    </Card>
  );
}
