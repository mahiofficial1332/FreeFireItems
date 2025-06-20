// 'use server';
/**
 * @fileOverview An AI agent to categorize Free Fire item icons.
 *
 * - categorizeIcons - A function that categorizes Free Fire item icons.
 * - CategorizeIconsInput - The input type for the categorizeIcons function.
 * - CategorizeIconsOutput - The return type for the categorizeIcons function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeIconsInputSchema = z.array(
  z.object({
    itemID: z.string().describe('The item ID of the Free Fire item.'),
    description: z.string().describe('The description of the Free Fire item.'),
    description2: z.string().describe('The secondary description of the Free Fire item.'),
    icon: z.string().describe('The icon name of the Free Fire item.'),
  })
).describe('An array of Free Fire item objects.');

export type CategorizeIconsInput = z.infer<typeof CategorizeIconsInputSchema>;

const CategorizeIconsOutputSchema = z.array(
  z.object({
    itemID: z.string().describe('The item ID of the Free Fire item.'),
    category: z.string().describe('The category of the Free Fire item (e.g., weapon, accessory, consumable).'),
  })
).describe('An array of Free Fire item IDs with their assigned categories.');

export type CategorizeIconsOutput = z.infer<typeof CategorizeIconsOutputSchema>;

export async function categorizeIcons(input: CategorizeIconsInput): Promise<CategorizeIconsOutput> {
  return categorizeIconsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeIconsPrompt',
  input: {schema: CategorizeIconsInputSchema},
  output: {schema: CategorizeIconsOutputSchema},
  prompt: `You are an expert in categorizing items from the game Free Fire.

  Given the following list of Free Fire items, categorize each item into one of the following categories: Weapon, Accessory, Consumable, or Other.
  Return a JSON array where each object contains the itemID and the determined category for that item.

  Items:
  {{#each this}}
  - ItemID: {{itemID}}, Description: {{description}}, Description2: {{description2}}, Icon: {{icon}}
  {{/each}}`,
});

const categorizeIconsFlow = ai.defineFlow(
  {
    name: 'categorizeIconsFlow',
    inputSchema: CategorizeIconsInputSchema,
    outputSchema: CategorizeIconsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
