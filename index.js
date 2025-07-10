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
        from: "setup/features/i18n/Language",
        to: "src/components/shared/Language",
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
          /{\/\* PLACEHOLDER_I18N_PROVIDER_START \*\/}([\s\S]*?){\/\* PLACEHOLDER_I18N_PROVIDER_END \*\/}/,
        replace: `/* PLACEHOLDER_I18N_PROVIDER_START */\n<I18nProvider>$1</I18nProvider>\n/* PLACEHOLDER_I18N_PROVIDER_END */`,
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
        replace: `// PLACEHOLDER_PWA_IMPORT
import withPWA from "next-pwa";

const withPwa = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\\.json$/, /app-build-manifest\\.json$/],
});`,
      },
    ],
  },

  theme: {
    label: "🌙 Theme (next-themes)",
    packages: ["next-themes"],
    files: [
      {
        from: "setup/features/theme/ThemeSwitcher.tsx",
        to: "src/components/shared/ThemeSwitcher.tsx",
      },
    ],
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
      initial: false,
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

  // Install dependencies
  for (const key of selectedFeatures) {
    const feature = features[key];
    const deps = feature.packages.filter((p) => !p.startsWith("@types/"));
    const devDeps = feature.packages.filter((p) => p.startsWith("@types/"));

    if (deps.length)
      execSync(`npm install ${deps.join(" ")}`, {
        stdio: "inherit",
        cwd: path.resolve(process.cwd(), folder),
      });

    if (devDeps.length)
      execSync(`npm install -D ${devDeps.join(" ")}`, {
        stdio: "inherit",
        cwd: path.resolve(process.cwd(), folder),
      });

    console.log(`✅ Installed: ${key}`);
  }

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
  const hasI18n = selectedFeatures.includes("i18n");

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
  console.log("📁 Footer & LandingPage copied based on i18n feature");

  // Inject code
  for (const key of selectedFeatures) {
    const feature = features[key];
    for (const injection of feature.injectCode) {
      const filePath = path.resolve(process.cwd(), folder, injection.file);
      await injectCode(filePath, injection.search, injection.replace);
    }
    console.log(`✍️ Code injected for: ${key}`);
  }

  // Clean up all placeholders (whether used or not)
  const layoutPath = path.resolve(process.cwd(), folder, "src/app/layout.tsx");
  const navbarPath = path.resolve(
    process.cwd(),
    folder,
    "src/components/layout/Navbar.tsx"
  );
  const cssPath = path.resolve(process.cwd(), folder, "src/styles/globals.css");

  const filesToClean = [layoutPath, navbarPath, cssPath];

  for (const file of filesToClean) {
    await injectCode(file, /\/\/ PLACEHOLDER_[A-Z_]+/g, "");
    await injectCode(
      file,
      /{\/\* PLACEHOLDER_[A-Z_]+_START \*\/}([\s\S]*?){\/\* PLACEHOLDER_[A-Z_]+_END \*\/}/g,
      "$1"
    );
    await injectCode(file, /{\/\* PLACEHOLDER_[A-Z_]+ \*\/}/g, "");
    await injectCode(file, /<Toaster \/>/g, "");
  }

  // Remove setup folder
  const setupPath = path.resolve(process.cwd(), folder, "setup");
  if (fs.existsSync(setupPath)) {
    fs.rmSync(setupPath, { recursive: true, force: true });
    console.log("🧹 Setup folder removed");
  }

  // Final Summary
  console.log(
    `\n✅ Features enabled: ${selectedFeatures
      .map((f) => features[f].label)
      .join(" | ")}`
  );
  console.log(`🚀 Project created at: ./${folder}`);
  console.log("👉 To start developing:");
  console.log(`   cd ${folder} && npm run dev\n`);
}

run();
