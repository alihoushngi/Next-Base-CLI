"use client";
import Button from "@/components/shared/Button/Button";

const LandingPage = () => {
  return (
    <section className="text-black dark:text-blue-50 py-7 flex flex-col gap-12 max-w-[950px] m-auto ltr text-left">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h2 className="font-light text-xl text-center">
          Build Smarter, Launch Faster 🚀
        </h2>
        <h1 className="font-black text-3xl text-center">
          Next Base – The Ultimate Next.js Starter Template
        </h1>
        <p className="text-center">
          Pre-configured with TypeScript, Tailwind CSS, Redux, Axios, and more —
          so you can skip setup and start building scalable, modern apps right
          away.
        </p>
      </div>
      <Button
        href="https://github.com/alihoushngi/Next-Base"
        target="_blank"
        aria-label="github link"
        link
        className="m-auto pl-3 pr-5"
      >
        Get Started on GitHub
      </Button>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full flex flex-col gap-2 justify-start bg-white dark:bg-black p-4 rounded-ss-xl rounded-se-xl">
          <h3 className="font-bold text-xl">
            Everything You Need — Out of the Box
          </h3>
          <p className="font-light text-sm">
            Next Base is packed with the tools and structure every modern web
            app needs, right from the start:
          </p>
        </div>
        <div className="w-full dark:bg-gray-800 bg-slate-50 rounded-es-xl rounded-ee-xl p-4">
          <ul>
            <li>✅ TypeScript, ESLint, and Prettier</li>
            <li>🎨 Tailwind CSS and Dark Mode Support</li>
            <li>⚛️ Redux Toolkit & React Toastify</li>
            <li>🔌 Axios with Interceptors</li>
            <li>🧠 Custom Hooks & Utility Functions</li>
            <li>📂 Scalable Folder Structure</li>
            <li>🔍 SEO-Ready with next-seo</li>
            <li>🚀 Git Hooks & Pre-commit Checks with Husky</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full flex flex-col gap-1 justify-start">
          <h3 className="font-bold text-xl">
            Built on Cutting-Edge Technologies
          </h3>
          <p className="font-light text-sm">
            Next Base is powered by the latest stable versions of:
          </p>
        </div>
        <div className="w-full ps-2 pt-2">
          <ul>
            <li>• Next.js 13+ App Router</li>
            <li>• TypeScript for robust typing</li>
            <li>• Tailwind CSS for lightning-fast UI building</li>
            <li>• Redux Toolkit for state management</li>
            <li>• Axios for HTTP requests</li>
            <li>• ESLint + Prettier + Husky for code quality</li>
            <li>• next-seo for easy SEO integration</li>
          </ul>
        </div>
        <q className="mt-4 w-full">
          Designed for scalability, flexibility, and rapid development.
        </q>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full flex flex-col gap-1 justify-start">
          <h3 className="font-bold text-xl">Clean & Scalable Architecture</h3>
          <p className="font-light text-sm">
            Organized with real-world production apps in mind. Feature-based
            folders, reusable components, modular API structure, and state
            management — all configured for you.
          </p>
        </div>
        <div className="w-full mt-4 flex justify-start">
          <Button
            href="https://github.com/alihoushngi/Next-Base/tree/main/src"
            target="_blank"
            link
            aria-label="github folders link"
            className="m-auto pl-3 pr-5"
          >
            See More on GitHub
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full flex flex-col gap-1 justify-start">
          <h3 className="font-bold text-xl">Why Choose Next Base?</h3>
        </div>
        <div className="w-full ps-2 pt-2">
          <ul>
            <li>• Save hours of setup time</li>
            <li>• Start building with confidence</li>
            <li>• Perfect for side-projects, startups, and SaaS products</li>
            <li>• Modern and maintainable codebase</li>
            <li>• Built by developers, for developers</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full flex flex-col gap-2 justify-start bg-white dark:bg-black p-4 rounded-ss-xl rounded-se-xl">
          <h3 className="font-bold text-xl">Clone, Install, Launch</h3>
        </div>
        <div className="w-full dark:bg-gray-800 bg-slate-50 rounded-es-xl rounded-ee-xl p-4">
          <ul>
            <li>git clone https://github.com/alihoushngi/Next-Base.git</li>
            <li>cd next-base</li>
            <li>npm install</li>
            <li>npm run dev</li>
          </ul>
        </div>
        <q className="mt-4 w-full">
          That’s it. Your project is ready to scale.
        </q>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full flex flex-col gap-1 justify-start">
          <h3 className="font-bold text-xl">What’s Coming Next?</h3>
        </div>
        <div className="w-full ps-2 pt-2">
          <ul>
            <li>🔐 Built-in Authentication (with JWT)</li>
            <li>🌍 Internationalization (i18n)</li>
            <li>🧪 Unit & Integration Testing Setup</li>
            <li>📄 SSG Support for SEO Content</li>
            <li>📊 Analytics Integration (GA, Posthog)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
