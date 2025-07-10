#!/usr/bin/env node

const { execSync } = require("child_process");
const prompts = require("prompts");
const path = require("path");
const fs = require("fs-extra");

const { copyFolder, injectCode, resolvePath } = require("./utils");

const features = {
  i18n: {
    label: "🈯 i18n (react-i18next)",
    packages: [
      "i18next",
      "react-i18next",
      "i18next-http-backend",
      "i18next-browser-languagedetector",
      "i18next-resources-to-backend",
      "@types/react-i18next",
      "@types/i18next",
    ],
    files: [
      {
        from: "setup/features/i18n/client.ts",
        to: "src/i18n/client.ts",
      },
      {
        from: "setup/features/i18n/types.ts",
        to: "src/i18n/types.ts",
      },
      {
        from: "setup/features/i18n/Language/I18nProvider.tsx",
        to: "src/components/shared/I18n/I18nProvider.tsx",
      },
      {
        from: "setup/features/i18n/Language/LanguageSwitcher.tsx",
        to: "src/components/shared/Language/LanguageSwitcher.tsx",
      },
      {
        from: "setup/features/i18n/locales",
        to: "public/locales",
      },
    ],
    injectCode: [
      {
        file: "src/app/layout.tsx",
        search: /\/\/ PLACEHOLDER_I18N_IMPORT/,
        replace:
          'import I18nProvider from "@/components/shared/I18n/I18nProvider";',
      },
      {
        file: "src/app/layout.tsx",
        search:
          /{\/\*\s*PLACEHOLDER_I18N_PROVIDER_START\s*\*\/}([\s\S]*?){\/\*\s*PLACEHOLDER_I18N_PROVIDER_END\s*\*\/}/,
        replace: `{/* PLACEHOLDER_I18N_PROVIDER_START */}\n<I18nProvider>$1</I18nProvider>\n{/* PLACEHOLDER_I18N_PROVIDER_END */}`,
      },
      {
        file: "src/styles/globals.css",
        search: /\/\* PLACEHOLDER_I18N_FONTS \*\//,
        replace: `html {
  font-family: var(--font-fira);
}

html.font-fa {
  font-family: var(--font-vazir);
}`,
      },
      {
        file: "src/components/layout/Navbar.tsx",
        search: /\/\* PLACEHOLDER_I18N_SWITCHER_IMPORT \*\//g,
        replace: `import LanguageSwitcher from "@/components/shared/Language/LanguageSwitcher";`,
      },
      {
        file: "src/components/layout/Navbar.tsx",
        search: /{\/\* PLACEHOLDER_I18N_SWITCHER \*\/}/,
        replace: `<LanguageSwitcher />`,
      },
    ],
  },

  toast: {
    label: "🔔 Toast (react-hot-toast)",
    packages: ["react-hot-toast"],
    files: [],
    injectCode: [
      {
        file: "src/app/layout.tsx",
        search: /{\/\* PLACEHOLDER_TOASTER \*\/}/,
        replace: "<Toaster />",
      },
      {
        file: "src/app/layout.tsx",
        search: /{\/\* PLACEHOLDER_TOASTER_IMPORT \*\/}/,
        replace: `import { Toaster } from "react-hot-toast";`,
      },
      {
        file: "src/lib/base/requsetBase.ts",
        search: /{\/\* PLACEHOLDER_TOASTER_IMPORT \*\/}/,
        replace: `import toast from "react-hot-toast";`,
      },
      {
        file: "src/lib/base/requsetBase.ts",
        search: /{\/\* PLACEHOLDER_TOASTER_SUCCESS_MESSAGE \*\/}/,
        replace: `toast.success("درخواست با موفقیت انجام شد");`,
      },
      {
        file: "src/lib/base/requsetBase.ts",
        search: /{\/\* PLACEHOLDER_TOASTER_ERROR1_MESSAGE \*\/}/,
        replace: `toast.error(error.message || "خطایی رخ داده");`,
      },
      {
        file: "src/lib/base/requsetBase.ts",
        search: /{\/\* PLACEHOLDER_TOASTER_ERROR2_MESSAGE \*\/}/,
        replace: `toast.error("خطای ناشناخته");`,
      },
    ],
  },

  redux: {
    label: "🧠 Redux Toolkit",
    packages: ["@reduxjs/toolkit", "react-redux", "redux-persist"],
    files: [
      {
        from: "setup/features/redux/hooks.ts",
        to: "src/hooks/hooks.ts",
      },
      {
        from: "setup/features/redux/store",
        to: "src/store",
      },
    ],
    injectCode: [
      {
        file: "src/app/layout.tsx",
        search: /\/\/ PLACEHOLDER_REDUX_IMPORT/,
        replace: 'import { ReduxProvider } from "@/store/provider";',
      },
      {
        file: "src/app/layout.tsx",
        search:
          /{\/\* PLACEHOLDER_REDUX_PROVIDER_START \*\/}([\s\S]*?){\/\* PLACEHOLDER_REDUX_PROVIDER_END \*\/}/,
        replace: "<ReduxProvider>$1</ReduxProvider>",
      },
    ],
  },

  pwa: {
    label: "📱 PWA (next-pwa)",
    packages: ["next-pwa", "@types/service-worker-mock"],
    files: [
      {
        from: "setup/features/pwa/next-pwa.d.ts",
        to: "src/types/next-pwa.d.ts",
      },
    ],
    injectCode: [
      {
        file: "next.config.ts",
        search: /\/\/ PLACEHOLDER_PWA_IMPORT/,
        replace: `// PLACEHOLDER_PWA_IMPORT\nimport withPWA from "next-pwa";`,
      },
      {
        file: "next.config.ts",
        search: /const withPwa = \(\) => \{\};/, // حذف تابع فیک اولیه
        replace: `const withPwa = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\\.json$/, /app-build-manifest\\.json$/],
});`,
      },
      {
        file: "next.config.ts",
        search: /\/\/ PLACEHOLDER_EXPORT_CONFIG/, // جایگزینی اکسپورت
        replace: `// PLACEHOLDER_EXPORT_CONFIG\nexport default withPwa(nextConfig);`,
      },
      {
        file: "next.config.ts",
        search: /export default nextConfig;/, // حذف اکسپورت اشتباه
        replace: ``,
      },
    ],
  },

  theme: {
    label: "🌙 Theme (next-themes)",
    packages: ["next-themes"],
    files: [],
    injectCode: [
      {
        file: "src/components/layout/Navbar.tsx",
        search: /\/\* PLACEHOLDER_THEME_SWITCHER_IMPORT \*\//g,
        replace: `import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";`,
      },
      {
        file: "src/components/layout/Navbar.tsx",
        search: /{\/\* PLACEHOLDER_THEME_SWITCHER \*\/}/,
        replace: `<ThemeSwitcher />`,
      },
      {
        file: "src/app/layout.tsx",
        search: /\/\/ PLACEHOLDER_THEME_IMPORT/,
        replace: `import { ThemeProvider } from "next-themes";`,
      },
      {
        file: "src/app/layout.tsx",
        search:
          /{\/\* PLACEHOLDER_THEME_PROVIDER_START \*\/}([\s\S]*?){\/\* PLACEHOLDER_THEME_PROVIDER_END \*\/}/,
        replace: `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>$1</ThemeProvider>`,
      },
    ],
  },
};

async function run() {
  console.log("\n✨ Welcome to create-next-base CLI ✨\n");

  const { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: "📝 Enter project folder name:",
    validate: (name) => (name.trim() === "" ? "Name is required" : true),
  });

  const folder = projectName || "next-base-app";
  const selectedFeatures = [];

  for (const [key, feature] of Object.entries(features)) {
    const { enabled } = await prompts({
      type: "confirm",
      name: "enabled",
      message: `🔧 Include ${feature.label}?`,
      initial: true,
    });
    if (enabled) selectedFeatures.push(key);
  }

  console.log(`\n📁 Cloning base repo into ./${folder} ...`);
  execSync(`git clone https://github.com/alihoushngi/Next-Base.git ${folder}`, {
    stdio: "inherit",
  });

  // Remove .git and .next folders after cloning
  const projectPath = path.resolve(process.cwd(), folder);
  const foldersToRemove = [".git", ".next"];

  for (const dir of foldersToRemove) {
    const targetPath = path.join(projectPath, dir);
    if (fs.existsSync(targetPath)) {
      fs.removeSync(targetPath);
      console.log(`🗑️ Removed ${dir} folder`);
    }
  }

  const allPackages = selectedFeatures
    .flatMap((key) => features[key].packages)
    .filter(Boolean);

  if (allPackages.length > 0) {
    console.log(
      `📦 Installing selected feature packages:\n> ${allPackages.join(" ")}`
    );
    try {
      execSync(`npm install ${allPackages.join(" ")}`, {
        cwd: projectPath,
        stdio: "inherit",
      });
      console.log("✅ Packages installed successfully.\n");
    } catch (error) {
      console.error(
        "❌ Failed to install packages automatically. Please try installing them manually."
      );
      process.exit(1);
    }
  }

  const hasI18n = selectedFeatures.includes("i18n");

  // Override theme switcher file based on i18n
  const themeSwitcherFile = {
    from: hasI18n
      ? "setup/features/i18n/theme-switcher-i18n.tsx"
      : "setup/features/theme/ThemeSwitcher.tsx",
    to: "src/components/shared/ThemeSwitcher.tsx",
  };

  // Replace the default in features.theme.files
  const themeFeature = features["theme"];
  themeFeature.files = [themeSwitcherFile];

  // Copy files
  for (const key of selectedFeatures) {
    const feature = features[key];
    for (const filePair of feature.files) {
      const fromPath = resolvePath(filePair.from);
      const toPath = path.resolve(process.cwd(), folder, filePair.to);
      fs.ensureDirSync(path.dirname(toPath));
      fs.lstatSync(fromPath).isDirectory()
        ? fs.copySync(fromPath, toPath)
        : fs.copyFileSync(fromPath, toPath);
    }
    console.log(`📁 Copied files for: ${key}`);
  }

  // Copy fallback or feature Footer + LandingPage based on i18n

  const extraFiles = [
    {
      from: hasI18n
        ? "setup/features/i18n/footer-i18n.tsx"
        : "setup/fallbacks/i18n/footer-no-i18n.tsx",
      to: "src/components/layout/Footer.tsx",
    },
    {
      from: hasI18n
        ? "setup/features/i18n/landing-i18n.tsx"
        : "setup/fallbacks/i18n/landing-no-i18n.tsx",
      to: "src/components/ui/LandingPage/LandingPage.tsx",
    },
  ];

  for (const { from, to } of extraFiles) {
    const fromPath = resolvePath(from);
    const toPath = path.resolve(process.cwd(), folder, to);
    fs.ensureDirSync(path.dirname(toPath));
    fs.copyFileSync(fromPath, toPath);
  }

  // Inject code
  for (const key of selectedFeatures) {
    const feature = features[key];
    for (const injection of feature.injectCode) {
      const filePath = path.resolve(process.cwd(), folder, injection.file);
      await injectCode(filePath, injection.search, injection.replace);
    }
  }

  // Clean up all placeholders (whether used or not)
  const layoutPath = path.resolve(process.cwd(), folder, "src/app/layout.tsx");
  const navbarPath = path.resolve(
    process.cwd(),
    folder,
    "src/components/layout/Navbar.tsx"
  );
  const cssPath = path.resolve(process.cwd(), folder, "src/styles/globals.css");

  const nextConfigPath = path.resolve(process.cwd(), folder, "next.config.ts");

  const filesToClean = [layoutPath, navbarPath, cssPath, nextConfigPath];

  const cleanupPatterns = [
    /\/\/\s*PLACEHOLDER_[A-Z_]+/g,
    /\/\*\s*PLACEHOLDER_[A-Z_]+\s*\*\//g,
    /{\/\*\s*PLACEHOLDER_[A-Z_]+\s*\*\/}/g,
    /{\/\*\s*PLACEHOLDER_[A-Z_]+_START\s*\*\/}\n?/g,
    /\n?{\/\*\s*PLACEHOLDER_[A-Z_]+_END\s*\*\/}/g,
    /<Toaster \/>/g,
    /^\s*{\s*}\s*$/gm,
    /const withPwa = \(\) => \{\};/g, // حذف تابع فیک
    /export default nextConfig;/g, // حذف اکسپورت دوبل در صورت وجود
    /{\/\*\s*PLACEHOLDER_I18N_PROVIDER_START\s*\*\/}/g,
    /{\/\*\s*PLACEHOLDER_I18N_PROVIDER_END\s*\*\/}/g,
  ];

  for (const file of filesToClean) {
    for (const pattern of cleanupPatterns) {
      await injectCode(file, pattern, "");
    }
  }

  // Remove setup folder
  const setupPath = path.resolve(process.cwd(), folder, "setup");
  if (fs.existsSync(setupPath)) {
    fs.rmSync(setupPath, { recursive: true, force: true });
  }

  // Final Summary
  console.log(
    `\n✅ Features enabled: ${selectedFeatures
      .map((f) => features[f].label)
      .join(" | ")}`
  );
  console.log(`🚀 Project created at: ./${folder}`);
  console.log("👉 To start developing:");
  console.log(`   cd ${folder} && npm install && npm run dev\n`);
}

run();
