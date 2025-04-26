import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  siteTitle: string;
}

const Layout: React.FC<LayoutProps> = ({ children, siteTitle }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{siteTitle}</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-100 font-sans">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">{siteTitle}</h1>
          <nav className="mt-2">
            <a href="/" className="mr-4 hover:underline">Home</a>
            <a href="/posts" className="hover:underline">Posts</a>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
        <footer className="bg-gray-800 text-white text-center p-4">
          <p>© {new Date().getFullYear()} {siteTitle}</p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;