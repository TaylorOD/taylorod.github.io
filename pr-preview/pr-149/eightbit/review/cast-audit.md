# cast and movement review

The old sheet compared unscaled humans with animals already drawn at scene size. It could not support a height comparison. The new town sheet includes all 44 entries on shared ground lines, using their actual town sizes and the scene palette.

The model page has every declared facing, every supported action, measured pixel bounds and eight samples for the human walk. Scene scale applies to people and companions. Equipment and shadows count toward the displayed bounds. Scout sleeps indoors, so his sleeping pose uses its house size. The two deer remain unused.

The shared human walk now bends at the knees and swings its arms. Player speed follows body scale so the smaller town character does not cycle its legs several times faster than the house character. Its phase follows distance traveled for the player, neighbors, students and dog walkers. The side stance foot stays planted through the stance portion of the cycle. Hands render behind the torso when facing away. Seated left legs bend toward the left.

Companions now keep the same proportion to adults across rooms. Their following distance grows with their size. Rafters are larger, their paddles stay in the water and their lane clears the surfboard.

Browser checks covered the complete town height sheet, the shared human action sheet, all eight walking frames in each direction, Scout and a trail dog pose sheet, house travel to the desk, arcade travel from the bar to a cabinet, and desktop and phone layouts. These checks do not mean every frame of every animal animation has been visually approved. The catalog test renders every declared action and facing to catch invalid geometry.

The art remains a draft. The backgrounds still contain more texture than the procedural characters. This change fixes movement, scale comparisons and specific layering problems. It does not establish that the full art direction or every possible overlap is finished.
