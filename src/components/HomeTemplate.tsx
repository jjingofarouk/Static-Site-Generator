import React from 'react';
import Layout from './Layout';

interface Post {
  slug: string;
  title: string;
  date: string;
}

interface HomeTemplateProps {
  posts: Post[];
  siteTitle: string;
}

const HomeTemplate: React.FC<HomeTemplateProps> = ({ posts, siteTitle }) => {
  return (
    <Layout siteTitle={siteTitle}>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome to {siteTitle}</h2>
        <h3 className="text-xl font-semibold mb-2">Latest Posts</h3>
        <ul className="list-disc pl-6">
          {posts.map((post) => (
            <li key={post.slug} className="mb-2">
              <a href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </a>{' '}
              <span className="text-gray-600">
                ({new Date(post.date).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default HomeTemplate;