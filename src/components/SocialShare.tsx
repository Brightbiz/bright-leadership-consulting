import { Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SocialShareProps {
  title: string;
  text: string;
  url: string;
}

const SocialShare = ({ title, text, url }: SocialShareProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share your results with others.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">Share your results:</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.twitter)}
          aria-label="Share on X (Twitter)"
          className="h-10 w-10 rounded-full"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.linkedin)}
          aria-label="Share on LinkedIn"
          className="h-10 w-10 rounded-full"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.facebook)}
          aria-label="Share on Facebook"
          className="h-10 w-10 rounded-full"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          aria-label="Copy link"
          className="h-10 w-10 rounded-full"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
