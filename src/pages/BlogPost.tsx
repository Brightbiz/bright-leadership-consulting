import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Bookmark, ThumbsUp, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import SocialShare from "@/components/SocialShare";
import testimonialDavid from "@/assets/testimonial-david.jpg";
import testimonialEmily from "@/assets/testimonial-emily.jpg";
import testimonialSophia from "@/assets/testimonial-sophia.jpg";

// Mock blog post data - in production this would come from a database
const blogPosts = {
  "5-habits-of-highly-effective-leaders": {
    title: "5 Habits of Highly Effective Leaders in 2024",
    excerpt: "Discover the key habits that separate exceptional leaders from the rest. Learn actionable strategies to elevate your leadership game.",
    content: `
      <p class="text-xl text-muted-foreground mb-8 leading-relaxed">In today's rapidly evolving business landscape, effective leadership requires more than just traditional management skills. The most successful leaders have cultivated specific habits that enable them to navigate complexity, inspire their teams, and drive meaningful results.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">1. Practicing Intentional Presence</h2>
      <p class="mb-6">The best leaders understand that being physically present isn't enough. They practice intentional presence—giving their full attention to the person or task at hand. This means putting away devices during meetings, maintaining eye contact, and actively listening rather than waiting for their turn to speak.</p>
      <p class="mb-6">Research from Harvard Business Review shows that leaders who practice mindful presence see a 23% increase in team engagement and a 31% improvement in decision-making quality.</p>
      
      <blockquote class="border-l-4 border-primary pl-6 my-8 italic text-lg text-muted-foreground">"Leadership is not about being in charge. It's about taking care of those in your charge." — Simon Sinek</blockquote>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">2. Embracing Continuous Learning</h2>
      <p class="mb-6">Highly effective leaders never stop learning. They read voraciously, seek out mentors, attend conferences, and actively seek feedback from their teams. This growth mindset allows them to adapt to changing circumstances and bring fresh perspectives to their organizations.</p>
      <p class="mb-6">Consider setting aside at least 30 minutes daily for learning—whether that's reading industry publications, listening to podcasts, or engaging with thought leaders on professional networks.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">3. Building Psychological Safety</h2>
      <p class="mb-6">Google's extensive research on team effectiveness found that psychological safety was the number one factor in high-performing teams. Effective leaders create environments where team members feel safe to take risks, voice their opinions, and admit mistakes without fear of punishment.</p>
      <p class="mb-6">This doesn't mean avoiding accountability—rather, it means responding to failures with curiosity rather than blame, and celebrating the learning that comes from taking calculated risks.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">4. Prioritizing Ruthlessly</h2>
      <p class="mb-6">With endless demands on their time, effective leaders have mastered the art of prioritization. They understand that saying "yes" to one thing means saying "no" to another, and they make these trade-offs consciously and strategically.</p>
      <p class="mb-6">The Eisenhower Matrix remains a powerful tool: categorize tasks by urgency and importance, delegate what you can, and eliminate what doesn't align with your core objectives.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">5. Leading with Vulnerability</h2>
      <p class="mb-6">Perhaps counterintuitively, the strongest leaders are those willing to show vulnerability. Admitting when you don't know something, acknowledging mistakes, and sharing your own challenges builds trust and encourages authenticity throughout the organization.</p>
      <p class="mb-6">Brené Brown's research demonstrates that vulnerability is the birthplace of innovation, creativity, and change—all essential elements of effective leadership.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">Implementing These Habits</h2>
      <p class="mb-6">Building new habits takes time and intentionality. Start by choosing one habit to focus on for the next 30 days. Track your progress, reflect on what's working, and gradually incorporate the others.</p>
      <p class="mb-6">Remember, leadership is not a destination but a journey of continuous improvement. The fact that you're seeking to grow is already a sign of effective leadership.</p>
    `,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop",
    category: "Leadership",
    author: {
      name: "Dr. Sarah Mitchell",
      role: "Executive Coach & Leadership Consultant",
      avatar: testimonialEmily,
      bio: "Dr. Sarah Mitchell has over 15 years of experience coaching C-suite executives at Fortune 500 companies. She holds a PhD in Organizational Psychology from Stanford and is the author of 'The Mindful Leader'.",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    date: "January 28, 2024",
    readTime: "8 min read",
    tags: ["Leadership", "Habits", "Management", "Growth"]
  },
  "building-resilient-teams-remote-work": {
    title: "Building Resilient Teams in the Remote Work Era",
    excerpt: "Remote work is here to stay. Learn how to build and maintain high-performing, resilient teams regardless of physical location.",
    content: `
      <p class="text-xl text-muted-foreground mb-8 leading-relaxed">The shift to remote work has fundamentally changed how teams operate. Building resilient teams in this new environment requires intentional strategies that prioritize connection, communication, and culture.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">The New Reality of Team Building</h2>
      <p class="mb-6">Gone are the days when team cohesion happened organically around the water cooler. Today's leaders must be more intentional about creating opportunities for connection and ensuring that remote team members feel valued and included.</p>
      <p class="mb-6">Studies show that remote workers who feel connected to their teams are 50% more productive and 76% more engaged in their work.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">Establishing Clear Communication Norms</h2>
      <p class="mb-6">Without the benefit of in-person cues, communication becomes even more critical. Establish clear norms around response times, preferred channels for different types of communication, and expectations for availability.</p>
      
      <blockquote class="border-l-4 border-primary pl-6 my-8 italic text-lg text-muted-foreground">"The single biggest problem in communication is the illusion that it has taken place." — George Bernard Shaw</blockquote>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">Creating Virtual Rituals</h2>
      <p class="mb-6">Replace the informal interactions that happen naturally in an office with intentional virtual rituals. This might include weekly virtual coffee chats, monthly team celebrations, or daily standups that include a personal check-in.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">Investing in the Right Tools</h2>
      <p class="mb-6">Technology is the backbone of remote team success. Invest in tools that facilitate collaboration, video conferencing, project management, and asynchronous communication. But remember—tools are only effective if people actually use them.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">Prioritizing Mental Health</h2>
      <p class="mb-6">Remote work can blur the boundaries between work and personal life, leading to burnout. Resilient teams actively prioritize mental health through flexible schedules, mental health days, and open conversations about well-being.</p>
    `,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    category: "Management",
    author: {
      name: "Michael Chen",
      role: "Organizational Development Specialist",
      avatar: testimonialDavid,
      bio: "Michael Chen specializes in helping organizations navigate digital transformation and remote work transitions. He has consulted for over 200 companies across 30 countries.",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    date: "January 25, 2024",
    readTime: "6 min read",
    tags: ["Remote Work", "Team Building", "Management", "Culture"]
  },
  "art-of-strategic-delegation": {
    title: "The Art of Strategic Delegation",
    excerpt: "Master the skill of delegation to multiply your impact and develop your team's capabilities.",
    content: `
      <p class="text-xl text-muted-foreground mb-8 leading-relaxed">Delegation is one of the most powerful yet underutilized tools in a leader's arsenal. When done strategically, it multiplies your impact, develops your team, and creates organizational resilience.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">Why Leaders Struggle to Delegate</h2>
      <p class="mb-6">Many leaders struggle with delegation for understandable reasons: fear of losing control, concern about quality, or simply the belief that they can do it faster themselves. But holding on too tightly limits both your capacity and your team's growth.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">The Delegation Matrix</h2>
      <p class="mb-6">Not all tasks are created equal when it comes to delegation. Consider both the task's importance and your team member's readiness. High-importance tasks to ready team members provide growth opportunities, while lower-importance tasks can help build skills progressively.</p>
      
      <blockquote class="border-l-4 border-primary pl-6 my-8 italic text-lg text-muted-foreground">"The best executive is one who has sense enough to pick good people to do what needs to be done, and self-restraint enough to keep from meddling while they do it." — Theodore Roosevelt</blockquote>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">Setting Up for Success</h2>
      <p class="mb-6">Effective delegation requires clarity around expectations, resources, authority, and deadlines. Take the time upfront to ensure your team member has everything they need to succeed—it will save time and frustration later.</p>
      
      <h2 class="text-2xl font-bold mt-10 mb-4">The Follow-Up Framework</h2>
      <p class="mb-6">Delegation isn't abandonment. Create a follow-up framework that provides support without micromanaging. Regular check-ins, milestone reviews, and an open-door policy for questions strike the right balance.</p>
    `,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
    category: "Strategy",
    author: {
      name: "Amanda Foster",
      role: "Executive Leadership Coach",
      avatar: testimonialSophia,
      bio: "Amanda Foster is an ICF-certified executive coach who has worked with leaders at companies including Google, Microsoft, and Amazon. She specializes in leadership development and strategic thinking.",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    date: "January 22, 2024",
    readTime: "5 min read",
    tags: ["Delegation", "Strategy", "Leadership", "Productivity"]
  }
};

const relatedPosts = [
  {
    slug: "building-resilient-teams-remote-work",
    title: "Building Resilient Teams in the Remote Work Era",
    excerpt: "Remote work is here to stay. Learn how to build and maintain high-performing, resilient teams.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop",
    category: "Management",
    readTime: "6 min read"
  },
  {
    slug: "art-of-strategic-delegation",
    title: "The Art of Strategic Delegation",
    excerpt: "Master the skill of delegation to multiply your impact and develop your team's capabilities.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    category: "Strategy",
    readTime: "5 min read"
  },
  {
    slug: "5-habits-of-highly-effective-leaders",
    title: "5 Habits of Highly Effective Leaders in 2024",
    excerpt: "Discover the key habits that separate exceptional leaders from the rest.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop",
    category: "Leadership",
    readTime: "8 min read"
  }
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug as keyof typeof blogPosts] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container-narrow text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter out current post from related posts
  const filteredRelatedPosts = relatedPosts.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16">
          <div className="container-narrow">
            <AnimatedSection>
              {/* Back Link */}
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                {post.excerpt}
              </p>

              {/* Author Row */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Featured Image */}
        <AnimatedSection delay={100}>
          <div className="container-narrow mb-12">
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </AnimatedSection>

        {/* Article Content */}
        <section className="pb-16">
          <div className="container-narrow">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12">
              {/* Main Content */}
              <AnimatedSection delay={150}>
                <article 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement Actions */}
                <div className="flex items-center justify-between mt-8 py-6 border-t border-b border-border">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Like</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Comment</span>
                    </Button>
                  </div>
                  <SocialShare 
                    title={post.title}
                    text={`Check out this article: ${post.title}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>

                {/* Author Bio Card */}
                <Card className="mt-12 bg-muted/30">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Avatar className="h-20 w-20 flex-shrink-0">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback className="text-2xl">{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Written by</p>
                        <h3 className="text-xl font-bold mb-1">{post.author.name}</h3>
                        <p className="text-primary font-medium mb-3">{post.author.role}</p>
                        <p className="text-muted-foreground mb-4">{post.author.bio}</p>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" asChild>
                            <a href={post.author.linkedin} target="_blank" rel="noopener noreferrer">
                              Connect on LinkedIn
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={post.author.twitter} target="_blank" rel="noopener noreferrer">
                              Follow on X
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Sidebar */}
              <aside className="space-y-8">
                <AnimatedSection delay={200}>
                  {/* Table of Contents */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4">In This Article</h3>
                      <nav className="space-y-2 text-sm">
                        <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                          1. Practicing Intentional Presence
                        </a>
                        <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                          2. Embracing Continuous Learning
                        </a>
                        <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                          3. Building Psychological Safety
                        </a>
                        <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                          4. Prioritizing Ruthlessly
                        </a>
                        <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                          5. Leading with Vulnerability
                        </a>
                      </nav>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection delay={250}>
                  {/* Newsletter CTA */}
                  <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">Get Leadership Tips</h3>
                      <p className="text-primary-foreground/80 text-sm mb-4">
                        Join 5,000+ leaders receiving weekly insights.
                      </p>
                      <Button variant="secondary" className="w-full" asChild>
                        <Link to="/#lead-magnet">Subscribe Free</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container-narrow">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Articles</h2>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-3 gap-6">
              {filteredRelatedPosts.map((relatedPost, index) => (
                <AnimatedSection key={relatedPost.slug} delay={100 * index}>
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {relatedPost.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{relatedPost.readTime}</span>
                        </div>
                        <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
