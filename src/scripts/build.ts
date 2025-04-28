import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PostTemplate from '../components/PostTemplate';
import HomeTemplate from '../components/HomeTemplate';
import { siteConfig } from './config';

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

const CONTENT_DIR = path.join(__dirname, '../../', siteConfig.contentDir);
const DIST_DIR = path.join(__dirname, '../../', siteConfig.outputDir);
const PUBLIC_DIR = path.join(__dirname, '../../', siteConfig.publicDir);

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Copy public assets to dist
const copyPublicAssets = () => {
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });
  }
};

// Build individual post pages
const buildPosts = async (): Promise<Post[]> => {
  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
  const posts: Post[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(CONTENT_DIR, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(rawContent);

      const slug = file.replace('.md', '');
      const title = data.title || 'Untitled Post';
      const date = data.date || new Date().toISOString();
      const htmlContent = await marked.parse(content); // Await the Promise

      const post: Post = { slug, title, date, content: htmlContent };
      posts.push(post);

      // Render post page
      const element = React.createElement(PostTemplate, {
        title,
        date,
        content: htmlContent,
        siteTitle: siteConfig.siteTitle,
      });
      const html = ReactDOMServer.renderToStaticMarkup(element);

      // Write to pretty URL (e.g., /posts/slug/index.html)
      const outputDir = path.join(DIST_DIR, 'posts', slug);
      fs.mkdirSync(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, 'index.html');
      fs.writeFileSync(outputPath, `<!DOCTYPE html>\n${html}`);

      console.log(`Built post: /posts/${slug}`);
    } catch (error) {
      console.error(`Error building ${file}:`, error);
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Build homepage
const buildHomepage = async (posts: Post[]) => {
  try {
    const element = React.createElement(HomeTemplate, {
      posts,
      siteTitle: siteConfig.siteTitle,
    });
    const html = ReactDOMServer.renderToStaticMarkup(element);
    const outputPath = path.join(DIST_DIR, 'index.html');
    fs.writeFileSync(outputPath, `<!DOCTYPE html>\n${html}`);
    console.log('Built homepage: /index.html');
  } catch (error) {
    console.error('Error building homepage:', error);
  }
};

// Main build function
const build = async () => {
  console.log('Starting build...');
  copyPublicAssets();
  const posts = await buildPosts(); // Await the async function
  await buildHomepage(posts); // Await the async function
  console.log('Build completed successfully!');
};

// Run the build
build().catch(error => {
  console.error('Build failed:', error);
  process.exit(1); // Exit with error code to signal failure
});