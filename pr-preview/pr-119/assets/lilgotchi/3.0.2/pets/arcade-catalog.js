import { createGet } from "./minigames/get.js";
import { createBump } from "./minigames/bump.js";
import { createHeading } from "./minigames/heading.js";
import { createMemory } from "./minigames/memory.js";
import { createFlag } from "./minigames/flag.js";
import { createSprint } from "./minigames/sprint.js";
import { createHoops } from "./minigames/hoops.js";
export const games = {
  get: {
    name: "Get",
    create: createGet,
    instruction: "Catch 12 notes in 30 seconds. Dodge poop.",
    actions: ["left", "right"],
  },
  bump: {
    name: "Bump",
    create: createBump,
    instruction: "Stop the meter in the target. Win two of three bouts.",
    actions: ["bump"],
  },
  heading: {
    name: "Heading",
    create: createHeading,
    instruction:
      "Jump under the ball. Ten headers win. Three misses end the run.",
    actions: ["left", "jump", "right"],
  },
  memory: {
    name: "Memory",
    create: createMemory,
    instruction: "Watch your pet follow the arrows. Then repeat those directions. Complete five rounds.",
    actions: ["left", "up", "right"],
  },
  flag: {
    name: "Flag",
    create: createFlag,
    instruction: "Match the arrow: Left, Right or Both. When you see X, wait without pressing. Get 12 of 15 right.",
    actions: ["left", "both", "right"],
  },
  sprint: {
    name: "Sprint",
    create: createSprint,
    instruction: "Tap Run to race. Or enable steady running before Start.",
    actions: ["run"],
  },
  hoops: {
    name: "Hoops",
    create: createHoops,
    instruction: "Tap Shoot to start the meter. Tap again inside the target. Make three of five baskets.",
    actions: ["shoot"],
  },
};
