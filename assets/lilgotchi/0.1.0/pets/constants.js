export const C = {
  W: 32, H: 16, SCALE: 8,
  MAX_HUNGER: 4, MAX_HAPPY: 4, MAX_DISC: 100, DISC_INC: 25,
  MAX_WEIGHT: 99, MAX_POOP: 4,
  MEAL_WT: 1, SNACK_WT: 2, GAME_WT_LOSS: 1,
  EGG_MS: 90000,         // 90 seconds
  BABY_MS: 3600000,      // 1 hr
  CHILD_MS: 86400000,    // 24 hr
  TEEN_MS: 86400000,     // 24 hr
  HUNGER_DECAY: { baby:1800000, child:3600000, teen:3600000, adult:3600000 },
  HAPPY_DECAY:  { baby:1800000, child:3600000, teen:3600000, adult:4200000 },
  POOP_RATE:    { baby:900000, child:10800000, teen:10800000, adult:10800000 },
  SLEEP: { baby:{s:20,w:9}, child:{s:20,w:9}, teen:{s:21,w:9}, adult:{s:22,w:9} },
  BASE_WT: { baby:5, child:10, teen:20, adult:30 },
  CARE_WINDOW: 900000,   // 15 min
  ADULT_MAX_MISTAKES: 5,
  MAX_AGE: 25,
  SNACK_SICK: 10,
};

