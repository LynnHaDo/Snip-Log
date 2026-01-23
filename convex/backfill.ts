import { internal } from "./_generated/api";
import { action } from "./_generated/server";

export const runSearchMetadataBackFill = action({
    handler: async (context) => {
        let processed = 0;

        while (true) {
            const batch = await context.runQuery(internal.snippets.getUnprocessedSnippets);
            if (batch.length == 0) break;

            // Prepare the updates
            const updates = batch.map((snippet) => ({
                id: snippet._id,
                metadata: `${snippet.title.toLocaleLowerCase()} ${snippet.userName.toLocaleLowerCase()}`
            }))

            // Apply the updates
            await context.runMutation(internal.snippets.backfillSearchMetadata, {
                updates
            })

            processed += batch.length
            console.log(`Updated ${processed} snippets...`)
        }

        return `Successfully backfilled ${processed} snippets.`;
    }
})

export const runLanguageStatBackFill = action({
    handler: async (context) => {
        await context.runMutation(internal.snippets.backfillTopLanguages)
        return `Successfully backfilled top languages stats.`
    },
})