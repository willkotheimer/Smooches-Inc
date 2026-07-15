export interface ServicePreset {
  name: string;
  description: string;
}

// Common favors a user can add to their bank (source: 'preset').
export const servicePresets: ServicePreset[] = [
  { name: 'Bring me coffee', description: 'Just how I like it' },
  { name: 'Give me a massage', description: '15 minutes' },
  { name: 'Make me breakfast', description: 'Eggs, bacon, toast' },
  { name: 'Do the dishes', description: 'Including the pans' },
  { name: 'Vacuum the living room', description: 'Under the couch too' },
  { name: 'My special request', description: '(you know the one) 😉' },
];
