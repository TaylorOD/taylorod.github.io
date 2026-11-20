# More games for lilgotchi

2.0 adds seven games. The timing and scores are our rules, not a claim of exact hardware behavior.

## The guessing game

[Left and right](left-right.md) now shows a visible turn in both directions, including symmetrical characters. Its rules and rewards stay the same.

## The 2.0 lineup

| Game | What you do |
| --- | --- |
| [Get](get.md) | Catch notes and dodge poop |
| [Bump](bump.md) | Stop a power meter and bump an opponent |
| [Heading](heading.md) | Move under a ball and head it upward |
| [Memory](memory.md) | Repeat a growing arrow sequence |
| [Flag](flag.md) | Follow real cues and ignore fake ones |
| [Sprint](sprint.md) | Tap or hold to race |
| [Hoops](hoops.md) | Time basketball shots |

The existing guessing game stays. Each new game has its own model and tests. They share controls, pause behavior and care rewards.

This is the seven game Connection set, not every game from every Tamagotchi. The [catalog](catalog.md) keeps the wider research backlog separate.

## Keep the widget small

Play opens a game picker. Game names, instructions, score, progress, pause and exit sit outside the pixel display. Show one short instruction before Start. The display is for the pet and playfield.

Use a 32 by 24 game field and integer pixels. Give each game up to three large touch controls below it, with matching keyboard controls. Do not put a tiny menu or text over the pet. Keep the same layout for all four families.

Use the current pet and evolution. Draw new poses when needed. A symmetrical sprite flipped horizontally is not a visible turn. Keep eyes, toppings, antennae, cracks and readable symbols recognizable. Check the largest adult and elder forms before approving the layout.

## Shared game rules

The 2.0 contract:

1. Keep the existing play restrictions for eggs, sleeping, sick, dead or vacation pets. Explain unavailable games beside their names. No new stage locks in the first batch.
2. Pause the round when the drawer closes or the page hides. On return, offer Resume or Quit. No hidden timers, free points or automatic losses. Care time follows the existing game rules.
3. End a run if the pet dies, starts vacation or changes family. Cancel old callbacks so they cannot affect the next pet.
4. A win gives one happiness heart, capped at four, once per finished run. A loss or quit gives none. No coins, betting, inventory, new evolution rules or extra weight changes in this first batch. Settle the existing energy effect once per started run, not per tap.
5. Keep an unfinished run in memory only. Reloading ends it without a reward. High scores are outside the first batch.
6. Keep sound optional. Every sound cue needs a visible cue. Reduced motion removes decoration, not essential game feedback. Pause stays available. Announce instructions, results and discrete cues without reading every animation frame.

## Review notes

2.0 is released. The next polish pass keeps the full current pet in each game, adds room around the controls and makes the cues easier to follow. That pass is still in review. Physical phone playtesting, audio listening, human screen reader checks and longer balance sessions remain unverified. See the [review checklist](release-checklist.md).

## Before shipping

Verify input, collisions, scoring, pause, exit, repeat rewards and family switching. Test every hatched sprite against screen bounds. Review the actual games in desktop and mobile browsers, including touch targets, keyboard focus and muted play. Capture screenshots in each PR. For timing games, also review a short recording.

Source for the seven Connection games: [Bandai's manual](https://www.bandai.com/amfile/file/download/file/242/product/1304058/). Their controls and objectives are references. The durations and win conditions in these docs are our starting balance choices.
