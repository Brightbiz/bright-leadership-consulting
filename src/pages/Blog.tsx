import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, User, Tag, Search, TrendingUp, Users, Lightbulb, Target, Calendar, Flame, BookOpen, Quote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogHero from "@/components/heroes/BlogHero";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { id: "all", label: "All Posts", icon: Tag },
  { id: "leadership", label: "Leadership", icon: TrendingUp },
  { id: "management", label: "Management", icon: Users },
  { id: "growth", label: "Personal Growth", icon: Lightbulb },
  { id: "strategy", label: "Strategy", icon: Target },
];

const blogPosts = [
  {
    id: 1,
    slug: "5-essential-traits-transformational-leaders",
    title: "5 Essential Traits of Transformational Leaders",
    excerpt: "Discover the key characteristics that set transformational leaders apart and how you can develop these traits in your own leadership journey.",
    category: "leadership",
    author: "Irene Agunbiade",
    authorImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop",
    date: "2025-01-28",
    readTime: "6 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "building-high-performance-teams-remote",
    title: "Building High-Performance Teams in a Remote World",
    excerpt: "Learn proven strategies for fostering collaboration, maintaining culture, and driving results with distributed teams.",
    category: "management",
    author: "Dr. Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop",
    date: "2025-01-24",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "emotional-intelligence-leadership-success",
    title: "Why Emotional Intelligence is the Key to Leadership Success",
    excerpt: "Explore how EQ impacts decision-making, team dynamics, and organizational outcomes in today's business environment.",
    category: "growth",
    author: "Marcus Williams",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
    date: "2025-01-20",
    readTime: "5 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "strategic-thinking-executives",
    title: "Strategic Thinking: A Framework for Executives",
    excerpt: "Master the art of strategic planning with our comprehensive framework designed for senior leaders navigating complexity.",
    category: "strategy",
    author: "Priya Sharma",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop",
    date: "2025-01-15",
    readTime: "10 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    slug: "feedback-culture-organizations",
    title: "Creating a Culture of Continuous Feedback",
    excerpt: "How to build an environment where feedback flows freely and drives continuous improvement at every level.",
    category: "management",
    author: "Dr. Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop",
    date: "2025-01-10",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    slug: "future-of-work-ai-leadership",
    title: "The Future of Work: AI and the Evolution of Leadership",
    excerpt: "Understand how artificial intelligence is reshaping leadership roles and what skills will be essential in the coming decade.",
    category: "strategy",
    author: "Irene Agunbiade",
    authorImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop",
    date: "2025-01-05",
    readTime: "9 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    slug: "inclusive-leadership-diverse-teams",
    title: "Inclusive Leadership: Driving Success Through Diversity",
    excerpt: "Learn how to create an inclusive environment that leverages diverse perspectives and drives innovation.",
    category: "leadership",
    author: "Marcus Williams",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
    date: "2024-12-28",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    slug: "resilience-uncertain-times",
    title: "Building Resilience: Leading Through Uncertain Times",
    excerpt: "Practical strategies for maintaining team morale and productivity during periods of change and uncertainty.",
    category: "growth",
    author: "Priya Sharma",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop",
    date: "2024-12-20",
    readTime: "6 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
  },
  {
    id: 9,
    slug: "delegation-mastery-leaders",
    title: "The Art of Delegation: A Leader's Most Powerful Tool",
    excerpt: "Master the skill of effective delegation to empower your team and multiply your impact as a leader.",
    category: "management",
    author: "Irene Agunbiade",
    authorImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop",
    date: "2024-12-15",
    readTime: "8 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop",
  },
];

const trendingPosts = blogPosts.slice(0, 4);

const authors = [
  {
    name: "Irene Agunbiade",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop",
    articles: 12,
  },
  {
    name: "Dr. Sarah Chen",
    role: "Leadership Coach",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop",
    articles: 8,
  },
  {
    name: "Marcus Williams",
    role: "Executive Consultant",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
    articles: 6,
  },
  {
    name: "Priya Sharma",
    role: "Strategy Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop",
    articles: 5,
  },
];

const featuredQuote = {
  text: "Leadership is not about being in charge. It's about taking care of those in your charge.",
  author: "Simon Sinek",
  role: "Author & Speaker",
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <BlogHero />

      {/* Featured Posts */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <AnimatedSection className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-8 bg-secondary rounded-full" />
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Featured</span>
            </div>
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Editor's Picks
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <AnimatedSection key={post.id} delay={index * 0.1}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary" className="capitalize">
                          {post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.authorImage} 
                            alt={post.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                        </div>
                        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-primary">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <Quote className="h-12 w-12 text-secondary mx-auto mb-6 opacity-60" />
              <blockquote className="font-serif text-2xl md:text-3xl text-primary-foreground leading-relaxed mb-6">
                "{featuredQuote.text}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-primary-foreground/30" />
                <p className="text-primary-foreground/80">
                  <span className="font-semibold">{featuredQuote.author}</span>
                  <span className="mx-2">·</span>
                  <span>{featuredQuote.role}</span>
                </p>
                <div className="h-px w-8 bg-primary-foreground/30" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Posts Column */}
            <div className="lg:col-span-2">
              {/* Filter Bar */}
              <AnimatedSection className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          activeCategory === category.id
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        <category.icon className="h-3.5 w-3.5" />
                        {category.label}
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-9"
                    />
                  </div>
                </div>
              </AnimatedSection>

              {/* Posts List */}
              <div className="space-y-8">
                {filteredPosts.map((post, index) => (
                  <AnimatedSection key={post.id} delay={index * 0.05}>
                    <Link to={`/blog/${post.slug}`} className="group block">
                      <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 aspect-video sm:aspect-square overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="sm:w-2/3 p-5 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="capitalize text-xs">
                                {post.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={post.authorImage} 
                                  alt={post.author}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-xs text-muted-foreground">{post.author}</span>
                                <span className="text-xs text-muted-foreground">· {post.readTime}</span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No articles found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Load More */}
              <AnimatedSection className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Load More Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Trending Posts */}
              <AnimatedSection>
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Flame className="h-5 w-5 text-secondary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">Trending Now</h3>
                  </div>
                  <div className="space-y-4">
                    {trendingPosts.map((post, index) => (
                      <Link 
                        key={post.id} 
                        to={`/blog/${post.slug}`}
                        className="group flex gap-4 items-start"
                      >
                        <span className="text-3xl font-serif font-bold text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Categories */}
              <AnimatedSection delay={0.1}>
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">Categories</h3>
                  </div>
                  <div className="space-y-3">
                    {categories.filter(c => c.id !== "all").map((category) => {
                      const count = blogPosts.filter(p => p.category === category.id).length;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <category.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {category.label}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>

              {/* Authors */}
              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="h-5 w-5 text-secondary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">Our Authors</h3>
                  </div>
                  <div className="space-y-4">
                    {authors.map((author) => (
                      <div key={author.name} className="flex items-center gap-3">
                        <img 
                          src={author.image} 
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-border"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{author.name}</h4>
                          <p className="text-xs text-muted-foreground">{author.role}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {author.articles} posts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Newsletter Sidebar */}
              <AnimatedSection delay={0.3}>
                <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-6 text-primary-foreground">
                  <h3 className="font-serif text-lg font-semibold mb-2">Subscribe to Updates</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Get the latest insights delivered to your inbox weekly.
                  </p>
                  <Input 
                    placeholder="Your email" 
                    className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 mb-3"
                  />
                  <Button variant="secondary" className="w-full">
                    Subscribe
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="relative rounded-3xl bg-card border border-border/50 p-10 md:p-16 text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              
              <div className="relative max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
                  Stay Ahead of the Curve
                </h2>
                <p className="text-muted-foreground mb-8">
                  Get weekly leadership insights, exclusive content, and practical strategies delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input placeholder="Enter your email" className="flex-grow" />
                  <Button variant="default">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Join 2,500+ leaders. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
