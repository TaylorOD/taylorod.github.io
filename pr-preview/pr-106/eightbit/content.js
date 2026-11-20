// Portfolio copy lives here. Scene geometry and drawing stay in their own files.
export const projects = [
  { id: 'lilgotchi', name: 'lilgotchi', category: 'a little company', color: '#a7dfaa', repo: 'lilgotchi', url: '/lilgotchi/', stack: 'javascript · web components · canvas', description: 'a little pixel pet that lives on your website. feed it, play games with it and watch it grow.', detail: 'a reusable web component, with pet care, games and saved progress. add it to a website with one line.', action: 'meet the pets', screen: 'pet' },
  { id: 'snowcrust', name: 'snowcrust', category: 'special delivery', color: '#f7ac75', repo: 'snowcrust', url: '/snowcrust/', stack: 'javascript · three.js', description: 'a 3d pizza game set in snow crash. take the call, make the pizza and send a RadiKS kourier.', detail: 'an interactive pizza kitchen with orders, cooking and deliveries. welcome to C0saN0stra Pizza.', action: 'make a pizza', screen: 'pizza' },
  { id: 'relay', name: 'relay', category: 'please break things', color: '#93d9e7', repo: 'relay', url: '/relay/', stack: 'node · typescript · react', description: 'a systems reliability playground. see what happens when requests pile up and services fail.', detail: 'a deterministic simulator shared by a browser playground and a node cli. compare retries and circuit breakers against the same failure. redis and postgres are context, not simulated services.', action: 'try the lab', screen: 'network' },
  { id: 'fight', name: 'fight terminal', category: 'next on the card', color: '#e9a4c0', repo: 'fight-terminal', url: '/fight-terminal/', stack: 'node · terminal · web', description: 'the ufc schedule, right in your terminal.', detail: 'find this weekend’s card, search a fighter or get json from the cli. the website shows the same schedule in your timezone. event times come from espn and can change.', action: 'see the schedule', screen: 'fight' },
  { id: 'sweat', name: 'mr game and sweat', category: 'keep moving', color: '#d1c1fa', repo: 'mr-game-and-sweat', url: 'https://mrgameandsweat.com/', stack: 'llm · retrieval augmented generation', description: 'video game reviews for playing while exercising.', detail: 'llm generated reviews and a chatbot that searches the review collection to answer questions about the games.', action: 'find a game', screen: 'bike' },
  { id: 'moonbean', name: 'moonbean coffee', category: 'coffee & questions', color: '#e3c38f', repo: 'moonbean_coffee', url: '/moonbean_coffee/', stack: 'llm · retrieval augmented generation', description: 'a fictional coffee shop with a handbook you can talk to.', detail: 'a public demo of a chatbot answering questions using a coffee shop handbook.', action: 'visit moonbean', screen: 'coffee' },
  { id: 'poker', name: 'poker seater', category: 'take a seat', color: '#9bcbb4', repo: 'poker_seater', url: '/poker_seater/', stack: 'javascript · web', description: 'random seat assignments for poker night.', detail: 'a small tool for getting everyone seated so the game can start.', action: 'pick the seats', screen: 'cards' },
  { id: 'reachoutt', name: 'reachoutt', category: 'keep in touch', color: '#e8c96d', repo: 'reachOutt', url: 'https://reachoutt.onrender.com/', stack: 'ruby on rails · vue', description: 'a little help remembering to keep in touch.', detail: 'keep track of the people you want to reach out to and your reminders in one place.', action: 'open reachoutt', screen: 'phone' },
];

export const pets = [
  { id: 'lilgotchi', name: 'lilgotchi', color: '#a7dfaa', description: 'small. curious. easily distracted.' },
  { id: 'slice', name: 'slice', color: '#f2bd76', description: 'a very good slice of company.' },
  { id: 'cypunk', name: 'cypunk', color: '#c6a4ec', description: 'probably thinking about computers.' },
];

export const jobs = [
  { title: 'software engineer II', company: 'home chef', when: 'current', url: 'https://www.homechef.com/' },
  { title: 'engineer', company: 'levels.fyi', when: 'previously', url: 'https://www.levels.fyi/' },
  { title: 'director of technical recruiting', company: 'talent solvers', when: 'before that' },
];

// Career examples from Taylor's November 2024 resume. Keep contact details private.
export const careerStories = {
  chef: { name: 'the home chef recipe', object: 'a recipe card', text: 'i built a new mobile signup funnel with react and tailwind, then refactored the stripe payment flow with react and ruby on rails. i also rebuilt the homepage and worked on partnership pages.', detail: 'the recipe: make the next step clear, especially on a small screen.' },
  levels: { name: 'the levels.fyi atlas', object: 'a company atlas', text: 'i built a homepage that suggested relevant companies based on a visitor’s location, using javascript, next.js and typescript.', detail: 'the idea: start with companies that are relevant to the person looking.' },
  recruiting: { name: 'the first office notebook', object: 'a recruiting notebook', text: 'before engineering, i opened a recruiting office in a new market and built a profitable business in its first year. i hired and trained a team of five recruiters and helped bootcamp graduates find their first engineering roles.', detail: 'a lot of listening, a lot of introductions and eventually a move to building things myself.' },
};

const SAVE_KEY = 'taylor-side-quest-v1';
export function loadProgress(storage) {
  try {
    storage ||= globalThis.localStorage;
    const saved = JSON.parse(storage.getItem(SAVE_KEY) || '{}');
    return {
      pet: pets.some(pet => pet.id === saved.pet) ? saved.pet : ({ sprout: 'lilgotchi', pixel: 'cypunk' }[saved.pet] || 'slice'),
      adopted: saved.adopted === true,
      stamps: Array.isArray(saved.stamps) ? [...new Set(saved.stamps.filter(id => projects.some(project => project.id === id)))] : [],
      pizza: ['carrying', 'delivered'].includes(saved.pizza) ? saved.pizza : 'none',
      visited: saved.visited === true,
    };
  } catch { return { pet: 'slice', adopted: false, stamps: [], pizza: 'none', visited: false }; }
}

export function saveProgress(progress) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); } catch { /* Exploring still works when storage is unavailable. */ }
}
