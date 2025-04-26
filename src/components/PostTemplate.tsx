```typescript
import React from 'react';
import Layout from './Layout';

interface PostTemplateProps {
  title: string;
  date: string;
  content: string;
  siteTitle: string;
}

const PostTemplate: React.FC<PostTemplateProps> = ({ title, date, content, siteTitle }) => {
  return (
    <Layout siteTitle={siteTitle}>
      <article className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">Published on {new Date(date).toLocaleDateString()}</p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </Layout>
  );
};

export default PostTemplate;