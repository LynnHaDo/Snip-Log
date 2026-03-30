import { LANGUAGES_CONFIGS } from "@/app/(root)/_constants/languageConfig";

const API_URL = process.env.CODE_EXECUTION_URL!;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runCodeExecutionCheck() {
  console.log("Starting code execution health check...");
  let failedCount = 0;
  let results: any[] = [];

  let languageEntries = Object.entries(LANGUAGES_CONFIGS);

  for (let [language, config] of languageEntries) {
    try {
        const startTime = performance.now();
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: config.defaultCode,
            runtimeConfig: config.runtimeConfig,
          }),
        });

        const data = await response.json();
        const endTime = performance.now();
        const duration = endTime - startTime;

        if (response.ok && data.output !== undefined) {
          results.push({
            lang: language,
            runtime: `${duration}ms`,
            status: `✅ ${response.status}`,
          });
        } else {
          results.push({
            lang: language,
            runtime: `${duration}ms`,
            error: `🔴 ${data.error}`,
          });
          failedCount++;
        }
      } catch (error: any) {
        results.push({
          lang: language,
          runtime: `N/A`,
          error: `🔴 ${error.message}`,
        });
        failedCount++;
      }
    
    await sleep(2000);
  }

  console.table(results)

  if (failedCount > 0) {
    console.error(
      `Code execution health check failed for ${failedCount} languages.`,
    );
    process.exit(1);
  } else {
    console.log(`Code execution health check is successful.`);
    process.exit(0);
  }
}

if (require.main === module) {
  runCodeExecutionCheck();
}
