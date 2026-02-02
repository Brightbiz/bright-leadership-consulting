import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, User, Tag, Search, TrendingUp, Users, Lightbulb, Target, Briefcase, Calendar } from "lucide-react";
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
    date: "2025-01-05",
    readTime: "9 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
  },
];

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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {post.author}
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

      {/* All Posts with Filter */}
      <section className="section-padding">
        <div className="container-narrow">
          {/* Filter Bar */}
          <AnimatedSection className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <AnimatedSection key={post.id} delay={index * 0.05}>
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="capitalize text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
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
